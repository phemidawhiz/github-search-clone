import React, { useEffect, useState } from 'react';
import { Input } from 'components/GitSearchInput/GitSearchInput';
import githublogo from 'assets/images/githublogo.png';
import styles from './dashboard.scss';
import statStyles from '../../components/GithubStats/GithubStats.scss';
import GitSearchButton from 'components/GitSearchButton/GitSearchButton';
import Header from 'components/Header/Header';
import { ResultItem, UserItem } from 'components/ResultItem/ResultItem';
import Router from 'next/router';
import { viewLoggedInUser, getRepositories, getUsers } from 'services/github.service';
import { ISearchResultReposInfo, ISearchResultUsersInfo } from 'types/interfaces';
import { formatCount, getPageNumbers, makeCountCommaSeperated } from 'lib/utils';
import { RECORDS_PER_PAGE } from 'config/constants';

const Dashboard: React.SFC<{}> = () => {

  // states
  const [fetchingResults, setFetchingResults] = useState(false);
  const [fetchedResults, setFetchedResults] = useState(false);
  const [username, setUsername] = useState('' as string);
  const [isUsersClicked, setIsUsersClicked] = useState(false); //check whether repo or user link is clicked
  const [avatarUrl, setAvatarUrl] = useState('' as string);
  const [searchParam, setSearchParam] = useState('' as string);
  const [inputErrorMessage, setInputErrorMessage] = useState('' as string);
  const [reposInfo, setReposInfo] = useState(null as unknown as ISearchResultReposInfo);
  const [usersInfo, setUsersInfo] = useState(null as unknown as ISearchResultUsersInfo);

  //get paginated records
  const getNextSetOfRecords = (endCursor: string | null, startCursor: string | null) => {
    if(isUsersClicked) {
      fetchUsers(searchParam, RECORDS_PER_PAGE, endCursor, startCursor);
    } else {
      fetchRepositories(searchParam, RECORDS_PER_PAGE, endCursor, endCursor);
    }
  }

  //search function
  const handleSearch = () => {
    if(searchParam !== "") {
      setInputErrorMessage("");
      setFetchingResults(true);
      fetchUsers(searchParam, RECORDS_PER_PAGE, null, null);
      fetchRepositories(searchParam, RECORDS_PER_PAGE, null, null);
    } else {
      setInputErrorMessage("please enter a search term");
    }
  }

  // get loggedIn user info from github
  const getUserName = () => {
    viewLoggedInUser().then((resp: any) => {
      setUsername(resp && resp?.response && resp?.response?.viewer && resp?.response?.viewer?.name);
      setAvatarUrl(resp && resp?.response && resp?.response?.viewer && resp?.response?.viewer?.avatarUrl);
    }).catch((err) => {
      console.error("error: ", err)
    });
  }

  // get list of repositories with count
  const fetchRepositories = (param: string, limit: number, endCursor: string | null, startCursor: string | null) => {
    getRepositories(`${param}` as string, limit, endCursor, startCursor).then((resp: any) => {
      if(resp && resp?.response && resp?.response?.search) {
        setReposInfo(resp?.response?.search);
      }
      
    }).catch((err) => {
      console.error("error: ", err)
    });
  }

  //get list of users with count
  const fetchUsers = (param: string, limit: number, endCursor: string | null, startCursor: string | null) => {
    setFetchedResults(true);
    getUsers(`${param}` as string, limit, endCursor, startCursor).then((resp: any) => {
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

    //check loggedIn state
    if(!loggedInState) {
      Router.push('/');
    }
  }, [])

  return (
    <>
      {
        !fetchedResults ? (
          <>{/* Render page with data from endpoint integration */}
            <Header 
              username={username} 
              avatarUrl={avatarUrl} 
              state={fetchedResults} 
            />

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
                  onClick={ () => handleSearch() } 
                >
                  Search Github
                </GitSearchButton>
              </div>
            </div>
          </>
        ) : (
          <>
            <Header 
              username={username} 
              handleSearch={handleSearch} 
              avatarUrl={avatarUrl} 
              state={fetchedResults} 
            />

            <div className={styles.results}>
              <div>
                <div className={statStyles.wrapper}>
                  <div className={ !isUsersClicked ? statStyles.fetched : ''} onClick={ () => setIsUsersClicked(false) }>
                    <p>Repositories <span>{formatCount(reposInfo && reposInfo?.repositoryCount)}</span></p>
                  </div>
                  <div className={ isUsersClicked ? statStyles.fetched : ''} onClick={ () => setIsUsersClicked(true) }>
                    <p>Users <span>{formatCount(usersInfo && usersInfo?.userCount)}</span></p>
                  </div>
                </div>
              </div>

              <div>
                <h2>{ isUsersClicked ? `${makeCountCommaSeperated(usersInfo && usersInfo?.userCount).slice(0, -3)} users results` : `${makeCountCommaSeperated(reposInfo && reposInfo?.repositoryCount).slice(0, -3)} repositories results`}</h2>
                {
                  isUsersClicked ? (
                    usersInfo?.edges.map( (item: any) => (
                        <div className={styles.resultItem}>
                          <UserItem 
                            name={item && item?.node?.name} 
                            otherInfo={item && item?.node?.bio} 
                            about={item && item?.node?.email} 
                          />
                        </div>
                      )
                    )
                  ) : (
                    reposInfo?.edges.map( (item: any) => (
                      <div className={styles.resultItem}>
                        <ResultItem 
                          title={item && item?.node?.name} description={item && item?.node?.description} 
                          stars={item && item?.node?.stargazers?.totalCount} 
                          license={item && item?.node?.licenseInfo?.name} 
                          updatedTime={item && item?.node?.updateAt} 
                        />
                      </div>
                      )
                    )
                  )
                }

                {/* Pagination */}
                <div className={styles.pagination}>
                  <span
                    onClick={ () => {
                      if(isUsersClicked) {
                        getNextSetOfRecords(usersInfo?.pageInfo?.endCursor, usersInfo?.pageInfo?.startCursor)
                      } else {
                        getNextSetOfRecords(reposInfo?.pageInfo?.endCursor, reposInfo?.pageInfo?.startCursor)
                      }
                    }}
                    className={(isUsersClicked ? (usersInfo?.pageInfo?.hasPreviousPage) : (reposInfo?.pageInfo?.hasPreviousPage)) ? styles.blackBox : ''}
                  >
                    &#60;
                  </span> 
                  <small>
                    { 
                      isUsersClicked ? getPageNumbers(reposInfo && reposInfo?.userCount) : getPageNumbers(usersInfo && usersInfo?.userCount)
                    }
                  </small> 
                  <span
                    onClick={ () => {
                      if(isUsersClicked) {
                        getNextSetOfRecords(usersInfo?.pageInfo?.endCursor, usersInfo?.pageInfo?.startCursor)
                      } else {
                        getNextSetOfRecords(reposInfo?.pageInfo?.endCursor, reposInfo?.pageInfo?.startCursor)
                      }
                    }}
                    className={(isUsersClicked ? (usersInfo?.pageInfo?.hasNextPage) : (reposInfo?.pageInfo?.hasNextPage)) ? styles.blackBox : ''}
                  >
                      &#62;
                  </span>
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
