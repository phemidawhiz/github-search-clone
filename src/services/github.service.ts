import { viewUser, repos, users } from './../queries/github.query';
import { createGQLClient } from 'lib/graphql';
import { IAuthInfo } from 'types/user';

const userInfo: IAuthInfo = JSON.parse(localStorage && localStorage?.getItem("user") as string) as IAuthInfo;

const client = createGQLClient(userInfo.access_token);

export const viewLoggedInUser = async () =>{
  const query = viewUser;

  const response = await client.request(query)
  .then((data) => {
    return {
      response: data,
    };
  })
  .catch(err => ({
    error: err.response && err.response.errors,
  }));

  return response;
}

export const getRepositories = async (param: string, limit: number) => { 

  const response = await client.request(repos, {
    searchParam: param,
    limit: limit
  })
  .then((data) => {
    return {
      response: data,
    };
  })
  .catch(err => ({
    error: err.response && err.response.errors,
  }));

  return response;
}

export const getUsers = async (param: string, limit: number) => { 

  const response = await client.request(users, {
    searchParam: param,
    limit: limit
  })
  .then((data) => {
    return {
      response: data,
    };
  })
  .catch(err => ({
    error: err.response && err.response.errors,
  }));

  return response;
}