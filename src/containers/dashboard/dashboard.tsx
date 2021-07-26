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
import { ISearchResultReposInfo, ISearchResultUsersInfo } from 'types/interfaces';

const Dashboard: React.SFC<{}> = () => {

  const [fetchingResults, setFetchingResults] = useState(false);
  const [fetchedResults, setFetchedResults] = useState(false);
  const [username, setUsername] = useState('' as string);
  const [avatarUrl, setAvatarUrl] = useState('' as string);
  const [searchParam, setSearchParam] = useState('' as string);
  const [inputErrorMessage, setInputErrorMessage] = useState('' as string);
  const [reposInfo, setReposInfo] = useState(null as unknown as ISearchResultReposInfo);
  const [usersInfo, setUsersInfo] = useState(null as unknown as ISearchResultUsersInfo);

  const handleSearch = () => {
    if(searchParam !== "") {
      setInputErrorMessage("");
      setFetchingResults(true);
      fetchUsers(searchParam, 10);
      fetchRepositories(searchParam, 10);
    } else {
      setInputErrorMessage("please enter a search term");
    }
  }

  const getUserName = () => {
    viewLoggedInUser().then((resp: any) => {
      setUsername(resp && resp?.response && resp?.response?.viewer && resp?.response?.viewer?.name);
      setAvatarUrl(resp && resp?.response && resp?.response?.viewer && resp?.response?.viewer?.avatarUrl);
    }).catch((err) => {
      console.error("error: ", err)
    });
  }

  const fetchRepositories = (param: string, limit: number) => {
    getRepositories(`${param}` as string, limit).then((resp: any) => {
      if(resp && resp?.response && resp?.response?.search) {
        setReposInfo(resp?.response?.search);
      }
      
    }).catch((err) => {
      console.error("error: ", err)
    });
  }

  const fetchUsers = (param: string, limit: number) => {
    setFetchedResults(true);
    getUsers(`${param}` as string, limit).then((resp: any) => {
      if(resp && resp?.response && resp?.response?.search) {
        setUsersInfo(resp?.response?.search);
      }
    }).catch((err) => {
      console.error("error: ", err)
    });
  }

  useEffect(() => {
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
              onClick={ () => handleSearch() } >Search Github</GitSearchButton>
            </div>
          </div>
        </>
      ) : (
        <>
          <Header username={username} handleSearch={handleSearch} avatarUrl={avatarUrl} state={fetchedResults} />
          <div className={styles.results}>
            <div>
              <GithubStats repositories={reposInfo && reposInfo?.repositoryCount} users={usersInfo && usersInfo.userCount} />
            </div>
            <div>
              <h2>{reposInfo && reposInfo?.repositoryCount} repository result</h2>
              {
                reposInfo?.edges.map( (item: any) => (
                  <div className={styles.resultItem}>
                    <ResultItem title={item && item?.node?.name} description={item && item?.node?.description} stars={item && item?.node?.stargazers?.totalCount} license={item && item?.node?.licenseInfo?.name} updatedTime={item && item?.node?.updateAt} />
                  </div>
                  )
                )
              }
              
              {
                usersInfo?.edges.map( (item: any) => (
                    <div className={styles.resultItem}>
                      <UserItem name={item && item?.node?.name} otherInfo={item && item?.node?.bio} about={item && item?.node?.email} />
                    </div>
                  )
                )
              }
            </div>
          </div>
        </>
        
      )
    }
    </>

  );
};

export default Dashboard;
