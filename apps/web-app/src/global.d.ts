import { ENV } from './infrastructure/constants';

declare global {
  declare namespace NodeJS {
    type EnvVarKeys = keyof typeof ENV.varNames;
    type EnvVarKeyNames = typeof ENV.varNames[EnvVarKeys];

    interface ProcessEnv {
      [key: EnvVarKeyNames]: string;
      // [key: string]: never;
    }
  }
}
