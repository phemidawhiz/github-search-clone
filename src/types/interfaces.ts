interface ILicenseInfo {
  name: string;
}

interface IStars {
  totalCount: number
}

interface IUserInfo {
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

export interface ISearchResultRepos {
  userCount: number;
  repositoryCount: number;
  edges: Array<ISearchResultRepoNode>;
}

export interface ISearchResultUserS {
  userCount: number;
  repositoryCount: number;
  edges: Array<IUserInfo>;
}


export interface IProfile {
  imagePath: string;
  username: string;
}

export interface IStats {
  repositories: number;
  users: number;
}

export interface IHeaderProps {
  username: string;
  state?: boolean;
  avatarUrl: string;
}

export interface IRepoInfo {
  title: string;
  description: string;
  stars: number;
  license: string;
  updatedTime: string;
  language: string;
}

export interface IUser {
  name: string;
  about: string;
  otherInfo: string;
}