import { IAuthInfo } from './../types/user';
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { IAuthData, IUserRole, IGroup } from '../types/user';

interface IAuthContext {
  loggedIn: boolean;
  logoutUser: () => void;
  updateUser: (authData: IAuthInfo) => void;
  user: IAuthData | IAuthInfo | null;
}

export const AuthContext = React.createContext<IAuthContext>({
  loggedIn: false,
  logoutUser: () => { },
  updateUser: (authData: IAuthInfo) => { },
  user: null
});
