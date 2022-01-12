import React from "react";

import { User } from "../components/app";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
const UserContext = React.createContext<User | undefined>(undefined);
/* eslint-enable @typescript-eslint/naming-convention */
/* eslint-enable unicorn/no-useless-undefined */
/* eslint-enable @typescript-eslint/no-explicit-any */

export default UserContext;
