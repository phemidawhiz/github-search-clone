import Router from 'next/router';
import React, { useState } from 'react';
import { IProfile } from 'types/interfaces';
import downArrow from 'assets/icons/gitsearchdownarrow.svg';

import styles from './GithubProfile.scss';
import { composeClasses } from 'utils/generic';

const GithubProfile: React.SFC<IProfile> = ({
  imagePath,
  username
}) => {

  const [clickedState, setClickedState] = useState(false);

  const changedClickedState = () => {
    if(clickedState) {
      setClickedState(false);
    } else {
      setClickedState(true);
    }
  }
  const handleLogout = () => {
    localStorage.clear();
    Router.push('/');
  } 
   return (
   <div className={styles.wrapper}>
      <img src={imagePath} onClick={ () => changedClickedState() } alt={username} /> 
      <h6 onClick={ () => changedClickedState() }>{username}</h6>
      {/* <span><img className={styles.downArrow} src={downArrow} /></span> */}
      <p className={ clickedState ? composeClasses(styles.logout, styles.clickedState) : styles.logout} onClick={ () => handleLogout()} >Logout</p>
    </div>
  );
}
export default GithubProfile;
