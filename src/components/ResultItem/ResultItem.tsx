import { makeTextShorter } from 'lib/utils';
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
  <div className={styles.wrapper} >
    <h4>{title || 'N/A'}</h4>
    <p>{makeTextShorter(description) || 'N/A'}</p>
    <p>{`${stars  || 'N/A'} stars | ${license  || 'N/A'} | ${updatedTime || 'N/A'}`}</p>
  </div>
);

export const UserItem: React.SFC<IUser> = ({
  name,
  about,
  otherInfo
}) => (
  <div className={composeClasses(styles.wrapper, styles.reducedHeight)} >
    <h4>{name  || 'N/A'} <span>{makeTextShorter(about)  || 'N/A'}</span></h4>
    <p>{makeTextShorter(otherInfo)  || 'N/A'}</p>
  </div>
);