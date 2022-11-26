import { createContext } from 'react';

export interface NavigationContextType {
  navigate?: (path: string, withRouter?: boolean) => Promise<void>;
  prefetch?: (path: string) => void;
}

export const NavigationContext = createContext<NavigationContextType>({});
