import { createContext, Dispatch, SetStateAction } from 'react';

export interface User {
  name: string;
  email: string;
  admin: boolean;
}

export interface UserContextType {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>> | undefined;
}

export const UserContext = createContext<UserContextType>({
  user: undefined,
  setUser: undefined,
});
