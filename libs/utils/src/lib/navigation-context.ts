import { createContext } from 'react';

export interface NavigationContextType {
  navigate?: (path: string, withRouter?: boolean) => Promise<void>;
}

export const NavigationContext = createContext<NavigationContextType>({});
