import React from "react";
import { Cafeteria, Configure, Home, Plan, User } from "grommet-icons";

import { Route } from "./routes";

interface NavbarRoute extends Route {
  name?: string;
  icon?: JSX.Element;
}

interface NavbarRoutes {
  [path: string]: NavbarRoute;
}

export const navbarRoutes: NavbarRoutes = {
  "/": {
    name: "Home",
    anonymous: true,
    exact: true,
    icon: <Home />,
    importFn: async () => import("../../components/home/home"),
  },

  "/customers": {
    icon: <User />,
    importFn: async () => import("../../features/customers/Customers"),
  },

  "/recipes": {
    icon: <Cafeteria />,
    importFn: async () => import("../../features/recipes/Recipes"),
  },

  "/planner": {
    icon: <Plan />,
    importFn: async () => import("../../features/planner/Planner"),
  },

  "/customisations": {
    icon: <Configure />,
    importFn: async () => import("../../features/exclusions/Exclusions"),
  },
};
