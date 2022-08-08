export interface LoginFormData {
  email: string;
  password: string;
}

export interface MfaFormData {
  code: string;
}

export interface ChangePasswordFormData {
  password: string;
}

export interface ChangePasswordAgainData {
  password: string;
  email: string;
}

export interface RegisterFormData {
  saluation: string;
  username: string;
  password: string;
  firstName: string;
  surname: string;
  email: string;
  contactNumber: string;
  postcode: string;
  telephone: string;
  addressLine1: string;
  addressLine2?: string;
  county?: string;
  townOrCity?: string;
}

export type SrpData =
  | LoginFormData
  | MfaFormData
  | ChangePasswordFormData
  | RegisterFormData;
