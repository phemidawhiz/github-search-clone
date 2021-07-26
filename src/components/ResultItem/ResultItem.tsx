import React from 'react';
import { IRepoInfo, IUser } from 'types/interfaces';
import { composeClasses } from 'utils/generic';

import styles from './ResultItem.scss';

export const ResultItem: React.SFC<IRepoInfo> = ({
  title,
  license,
  description,
  stars,
  updatedTime
}) => (
  <div className={styles.wrapper}>
    <h4>{title || 'N/A'}</h4>
    <p>{description || 'N/A'}</p>
    <p>{`${stars  || 'N/A'} stars | ${license  || 'N/A'} | ${updatedTime || 'N/A'}`}</p>
  </div>
);

export const UserItem: React.SFC<IUser> = ({
  name,
  about,
  otherInfo
}) => (
  <div className={composeClasses(styles.wrapper, styles.reducedHeight)}>
    <h4>{name  || 'N/A'} <span>{about  || 'N/A'}</span></h4>
    <p>{otherInfo  || 'N/A'}</p>
  </div>
);