export const viewUser = `
  query { 
    viewer { 
      name
      avatarUrl
    }
  }
`;

export const users = `
  query SearchUser($searchParam: String!, $limit: Int!, $endCursor: String, $startCursor: String) {
    search(query: $searchParam, type: USER, first: $limit, after: $endCursor, before: $startCursor) {
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
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`

export const repos =  `
query SearchRepo($searchParam: String!, $limit: Int!, $endCursor: String, $startCursor: String) {
  search(query: $searchParam, type: REPOSITORY, first: $limit, after: $endCursor, before: $startCursor) {
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
    pageInfo {
      hasNextPage
      endCursor
      hasPreviousPage
      startCursor
    }
  }
}

`;