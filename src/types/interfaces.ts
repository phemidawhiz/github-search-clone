interface ILicenseInfo {
  name: string;
}

interface IStars {
  totalCount: number
}

export interface IUserInfo {
  bio: string;
  name: string;
}

export interface ISearchResultRepoNode {
  description: string;
  name: string;
  updateAt: string;
  licenseInfo: ILicenseInfo;
  stargazers: IStars;
}

export interface IRepoArrayNode {
  node: ISearchResultRepoNode;
}

export interface ISearchResultReposInfo {
  userCount: number;
  repositoryCount: number;
  edges: Array<ISearchResultRepoNode>;
}

export interface ISearchResultUsersInfo {
  userCount: number;
  repositoryCount: number;
  edges: Array<IUserInfo>;
}


export interface IProfile {
  imagePath: string;
  username: string;
}

export interface IStats {
  repositories: number | undefined;
  users: number | undefined;
}

export interface IHeaderProps {
  username: string;
  state?: boolean;
  avatarUrl: string;
  handleSearch?: Function;
}

export interface IRepoInfo {
  title: string;
  description: string;
  stars: number;
  license: string;
  updatedTime: string;
}

export interface IUser {
  name: string;
  about: string;
  otherInfo: string;
}