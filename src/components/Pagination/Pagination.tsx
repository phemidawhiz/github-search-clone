import React from 'react';
import styles from '../../containers/requests/requests.scss';

interface IPaginationType {
  limit: number;
  pageNo: number;
  offset: number;
  total: number;
  setPageNo: any;
}
const Pagination: React.SFC<IPaginationType> = ({
  setPageNo,
  pageNo,
  offset,
  total,
  limit,
}) => (
    <div className={styles.pagination}>
      {offset > 0 && <span onClick={() => { setPageNo(pageNo - 1); }}>&lt;&nbsp;Prev</span>}
      &nbsp;&nbsp;{offset + 1}&nbsp;&ndash;&nbsp;{offset + limit}&nbsp;of&nbsp;{total}&nbsp;&nbsp;
    {!(offset + limit === total) && <span onClick={() => { setPageNo(pageNo + 1); }}>Next&nbsp;&gt;</span>}
    </div>
  );

export default Pagination;
