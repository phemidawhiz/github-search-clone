export const viewUser = `
  query { 
    viewer { 
      name
      avatarUrl
    }
  }
`;

export const users = `
  query SearchUser($searchParam: String!, $limit: Int!) {
    search(query: $searchParam, type: USER, first: $limit) {
      repositoryCount
      userCount
      edges {
        node {
          ... on User {
            id
            email
            bio
            name
          }
        }
      }
    }
  }
`

export const repos =  `
query SearchRepo($searchParam: String!, $limit: Int!) {
  search(query: $searchParam, type: REPOSITORY, first: $limit) {
    userCount
    repositoryCount
    edges {
      node {
        ... on Repository {
          name
          stargazers {
            totalCount
          }
          updatedAt
          description
          licenseInfo {
            name
          }
        }
      }
    }
  }
}

`;