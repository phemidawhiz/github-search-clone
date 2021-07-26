export default {
  app_domain: process.env.BASE_DOMAIN as string,
  github_app_client_ic: process.env.GITHUB_APP_CLIENT_ID as string,
  api_auth_uri: process.env.INDICINA_AUTH_BACKEND as string,
  redirect_uri: process.env.BASE_DOMAIN as string,
  github_graphql_url: process.env.GITHUB_GRAPHQL_API_URL as string,
  environment: process.env.NODE_ENV as string,

  defaultPath: '/app/dashboard',
};
