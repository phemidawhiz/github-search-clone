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
          //Router.push(config.defaultPath); //works smoothly without page reload but doesn't load styles
          window.location.assign(config.defaultPath); //to make sure stylesheets load properly
        })
        .catch(error => {
          console.log("error: ", error);
          setData({
            isLoading: false,
            errorMessage: "Sorry! Authentication failed"
          });
        });
    };

    const loggedInState: boolean = JSON.parse(localStorage.getItem("isLoggedIn") as string) as boolean;

    if(loggedInState) {
      Router.push('/app/dashboard');
    }
    
  }, []);

  return (
    <div className={styles.home}>
      <GitSearchButton loading={data.isLoading} disabled={data.isLoading} href={`https://github.com/login/oauth/authorize?scope=user&client_id=${config.github_app_client_ic}`} > Login to Github </GitSearchButton>
    </div>
  );
};

export default Home;
