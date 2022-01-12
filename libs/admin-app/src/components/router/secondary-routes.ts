import { Routes } from "./routes";

export const secondaryRoutes: Routes = {
  "/edit-customer/:id": {
    importFn: async () => import("../../features/customers/EditCustomerPage"),
  },

  "/new-customer": {
    importFn: async () => import("../../features/customers/NewCustomerPage"),
  },
};
