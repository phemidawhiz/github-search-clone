import { formatCount } from 'lib/utils';
import React from 'react';
import { IStats } from 'types/interfaces';

import styles from './GithubStats.scss';

const GithubStats: React.SFC<IStats> = ({
  repositories,
  users
}) => (
  <div className={styles.wrapper}>
    <div>
      <p>Repositories <span>{formatCount(repositories)}</span></p>
    </div>
    <div>
      <p>Users <span>{formatCount(users)}</span></p>
    </div>
  </div>
);

export default GithubStats;


