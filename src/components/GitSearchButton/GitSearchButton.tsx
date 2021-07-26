import React from 'react';
import Router from 'next/router';

import { ReactComponent as Loader } from 'assets/icons/loader.svg';
import { composeClasses } from '../../utils/generic';

import styles from './GitSearchButton.scss';

export interface IButtonProps {
  className?: string;
  disabled?: boolean;
  href?: string;
  loading?: boolean; // Loading indicator
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => void;
}

const GitSearchButton: React.SFC<IButtonProps> = ({
  children, className, href, loading, onClick, ...rest
}) => {
  const Element = href ? 'a' : 'button';

  const defaultLinkHandler = (event:
  React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    if (href) {
      // If it's a link, then handle the route with Next's router
      event.preventDefault();
      window.location.assign(href);
    }
  };

  const props = {
    className: composeClasses(
      className,
      styles.button,
      loading && styles.loading,
    ),
    onClick: onClick || defaultLinkHandler,
    ...rest,
  };

  return (
    <Element {...props}>
      {
        loading
          ? (
            <Loader style={{
              maxHeight: '15px',
              stroke: 'currentColor',
            }}
            />
          )
          : children
      }
    </Element>
  );
};

export default GitSearchButton;
