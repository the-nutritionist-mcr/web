import { RouteComponentProps } from "react-router-dom";
import React from "react";
import { navbarRoutes } from "./navbar-routes";
import { secondaryRoutes } from "./secondary-routes";

export interface Route {
  importFn: () => Promise<{ default: React.FC<RouteComponentProps> }>;
  exact?: boolean;
  anonymous?: boolean;
}

export interface Routes {
  [path: string]: Route;
}

export const routes = {
  ...navbarRoutes,
  ...secondaryRoutes,
};
