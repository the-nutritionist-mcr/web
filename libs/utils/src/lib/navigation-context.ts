import { createContext } from 'react';

export interface NavigationContextType {
  navigate?: (path: string) => Promise<void>;
}

export const NavigationContext = createContext<NavigationContextType>({});
