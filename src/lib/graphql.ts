import { GraphQLClient } from 'graphql-request';
import config from '../config';

export const createGQLClient = (token: string): GraphQLClient => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  

  const client = new GraphQLClient(
    config.github_graphql_url, 
    { headers: 
      {
        "Authorization": `Bearer ${token}`
      }
    }
  );

  return client;
};
