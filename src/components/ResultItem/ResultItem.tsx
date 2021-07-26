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
    <h4>{title}</h4>
    <p>{description}</p>
    <p>{`${stars} stars | ${license} | ${updatedTime}`}</p>
  </div>
);

export const UserItem: React.SFC<IUser> = ({
  name,
  about,
  otherInfo
}) => (
  <div className={composeClasses(styles.wrapper, styles.reducedHeight)}>
    <h4>{name} <span>{about}</span></h4>
    <p>{otherInfo}</p>
  </div>
);