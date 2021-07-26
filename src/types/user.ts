export interface IAuthInfo {
  access_token: string;
  scope: string;
  token_type: string;
}

export interface UserGroup {
  group: IGroup;
  role: IUserRole;
}

export interface IAuthData {
  id: string;
  email: string;
  phone: string;
  firstname: string;
  lastname: string;
  username: string;
  token: string;
  userGroup: UserGroup;
  userGroups?: UserGroup[];
}

export interface IUserRole {
  id: string;
  code: string;
  name: string;
}

export interface IGroup {
  id: number;
  name: string;
  transparent: boolean;
  organisationId: number
  organisation: IOrganisation;
}

export interface IOrganisation {
  cac: string;
  id: number;
  industryId: number;
  name: string;
  allowInvoice: boolean;
  allowKyc: boolean,
  status: boolean;
  slaPrice: number;
  address?: string;
  addressDateRange?: string;
  allowAddressPlatform?:boolean;
}

export interface IWebhookUpdateResponse {
  isOk: boolean;
}
export interface IAPIKeys {
  enabled: boolean;
  liveSecretKey: string;
  testSecretKey: string;
  publicKey: string;
  riskLevel: string
  identityPayloadType: string
}

export interface IWebhooks {
  liveWebhook: string;
  testWebhook: string;
  requiresAuth: boolean;
  testAuthKey?: string;
  testAuthValue?: string;
  liveAuthKey?: string;
  liveAuthValue?: string;
}
