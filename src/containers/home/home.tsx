import React, { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import styles from './home.scss';
import GitSearchButton from 'components/GitSearchButton/GitSearchButton';
import config from 'config';
import Router from 'next/router';
import { AuthContext } from 'contexts/auth';
import { IAuthInfo } from 'types/user';

const Home: NextPage<{}> = (): JSX.Element => {

  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  const {
    updateUser,
  } = useContext(AuthContext);

  const { user, loggedIn } = useContext(AuthContext);

  useEffect(() => {
    const url: string = window.location.href;
    const hasCode: boolean = url.includes("?code=");

    if (hasCode) {
      const newUrl: string[] = url.split("?code=");
      setData({ ...data, isLoading: true });

      const requestData: {code: string} = {
        code: newUrl[1]
      };

      // Use code parameter and other parameters to make POST request to API Authentication Backend
      fetch(config.api_auth_uri, {
        method: "POST",
        body: JSON.stringify(requestData)
      })
        .then(response => response.json())
        .then(data => {
          
          localStorage.setItem("isLoggedIn", JSON.stringify(true))
          localStorage.setItem("user", JSON.stringify(data?.data))
          updateUser(data as IAuthInfo);
          Router.push(config.defaultPath);
        })
        .catch(error => {
          console.log("error: ", error);
          setData({
            isLoading: false,
            errorMessage: "Sorry! Authentication failed"
          });
        });
    };
    
  }, []);

  return (
    <div className={styles.home}>
      <GitSearchButton href={`https://github.com/login/oauth/authorize?scope=user&client_id=${config.github_app_client_ic}`} > Login to Github </GitSearchButton>
    </div>
  );
};

export default Home;
