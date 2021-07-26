import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Input } from 'components/GitSearchInput/GitSearchInput';
import githublogo from 'assets/images/githublogo.png';
import styles from './dashboard.scss';
import GitSearchButton from 'components/GitSearchButton/GitSearchButton';
import Header from 'components/Header/Header';
import GithubStats from 'components/GithubStats/GithubStats';
import { ResultItem, UserItem } from 'components/ResultItem/ResultItem';
import { IAuthInfo } from 'types/user';
import Router from 'next/router';
import { viewLoggedInUser, getRepositories, getUsers } from 'services/github.service';
import { ISearchResultRepos, ISearchResultUserS } from 'types/interfaces';

const Dashboard: NextPage<{}> = (): JSX.Element => {

  const [fetchingResults, setFetchingResults] = useState(false);
  const [fetchedResults, setFetchedResults] = useState(false);
  const [username, setUsername] = useState('' as string);
  const [avatarUrl, setAvatarUrl] = useState('' as string);
  const [searchParam, setSearchParam] = useState('' as string);
  const [inputErrorMessage, setInputErrorMessage] = useState('' as string);
  const [reposInfo, setReposInfo] = useState(null as unknown as ISearchResultRepos);
  const [usersInfo, setUsersInfo] = useState(null as unknown as ISearchResultUserS);

  const getUserName = () => {
    viewLoggedInUser().then((resp: any) => {
      setUsername(resp && resp?.response && resp?.response?.viewer && resp?.response?.viewer?.name);
      setAvatarUrl(resp && resp?.response && resp?.response?.viewer && resp?.response?.viewer?.avatarUrl);
    }).catch((err) => {
      const errorMessage = err && err.response && err.response.errors[0].message;
      console.log("error: ", errorMessage)
    });
  }

  const fetchRepositories = (param: string, limit: number) => {
    getRepositories(`${param}` as string, limit).then((resp: any) => {
      if(resp && resp?.response && resp?.response?.search) {
        setReposInfo(resp && resp?.response && resp?.response?.search);
        console.log("repos: ", resp?.response?.search);
      }
      
    }).catch((err) => {
      const errorMessage = err && err.response && err.response.errors[0].message;
      console.log("error: ", errorMessage)
    });
  }

  const fetchUsers = (param: string, limit: number) => {
    setFetchedResults(true);
    getUsers(`${param}` as string, limit).then((resp: any) => {
      if(resp && resp?.response && resp?.response?.search) {
        setUsersInfo(resp && resp?.response && resp?.response?.search);
        console.log("users: ", resp?.response?.search);
      }
      
    }).catch((err) => {
      const errorMessage = err && err.response && err.response.errors[0].message;
      console.log("error: ", errorMessage)
    });
  }

  useEffect(() => {
    const userInfo: IAuthInfo = JSON.parse(localStorage.getItem("user") as string) as IAuthInfo;
    const loggedInState: boolean = JSON.parse(localStorage.getItem("isLoggedIn") as string) as boolean;

    getUserName();

    if(!loggedInState) {
      Router.push('/');
    }
  }, [])

  return (
    <>
    {
      !fetchedResults ? (
        <>
          <Header username={username} avatarUrl={avatarUrl} state={fetchedResults} />
          <div className={styles.searchPane}>
            <div>
              <img src={githublogo} alt="logo" />
            </div>
            <Input onChange={ (e) => setSearchParam(e.target.value)} />
            <div>
              <span className={styles.inputError}>{inputErrorMessage}</span>
            </div>
            <div>
              <GitSearchButton
              disabled={fetchedResults}
              loading={fetchingResults}
              onClick={ () => {
                if(searchParam !== "") {
                  setInputErrorMessage("");
                  setFetchingResults(true);
                  fetchUsers(searchParam, 100);
                  fetchRepositories(searchParam, 100);
                } else {
                  setInputErrorMessage("please enter a search term");
                }
                
              }} >Search Github</GitSearchButton>
            </div>
          </div>
        </>
      ) : (
        <>
          <Header username={username} avatarUrl={avatarUrl} state={fetchedResults} />
          <div className={styles.results}>
            <div>
              <GithubStats repositories={2310} users={34} />
            </div>
            <div>
              <h2>2,985 repository results</h2>
              <div className={styles.resultItem}>
                <ResultItem title={`Goselfie`} description={`Selfie Contest Angular App`} stars={412} license={`MIT License`} language={`Java`} updatedTime={`Updated 4 hours agos`} />
              </div>
              
              <div className={styles.resultItem}>
                <ResultItem title={`Github Search`} description={`Git Hub Search Clone`} stars={319} license={`GNU License`} language={`Typescript`} updatedTime={`Updated 5 hours agos`} />
              </div>

              <div className={styles.resultItem}>
                <UserItem name={`Ayodele Olufemi`} otherInfo={`just some other info`} about={`A cool coder`} />
              </div>
            </div>
          </div>
        </>
        
      )
    }
    </>
    
      
    

  );
};

export default Dashboard;
