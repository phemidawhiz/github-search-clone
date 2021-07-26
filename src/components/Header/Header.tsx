import GithubProfile from 'components/GithubProfile/GihubProfile';
import React from 'react';
import githublogo from 'assets/images/githublogo.png';
import styles from './Header.scss';
import { IHeaderProps } from 'types/interfaces';
import { composeClasses } from 'utils/generic';

const Header: React.SFC<IHeaderProps> = ({
  username,
  avatarUrl,
  state
}) => {
  
  return (
    <div className={ state ? styles.wrapper : composeClasses(styles.wrapper, styles.noBox)}>
      <div>
        {
          state ? (
            <img src={githublogo} alt="logo" />
          ) : (
            ''
          )
        }
        
      </div>
      <div>
        {
            state ? (
              'Search'
            ) : (
              ''
            )
          }
      </div>
      <div>
        <GithubProfile username={username} imagePath={avatarUrl} />
      </div>
    </div>
  );

}

export default Header;