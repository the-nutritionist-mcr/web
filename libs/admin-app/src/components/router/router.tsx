import { TnmRoute } from "..";
import { Box } from "grommet";
import React from "react";
import { Spinning } from "grommet-controls";
import { useAsyncResource } from "use-async-resource";
import { fetchCustomers } from "../../features/customers/customersSlice";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import AppState from "../../types/AppState";
import { AnyAction } from "redux";
import { fetchExclusions } from "../../features/exclusions/exclusionsSlice";
import { fetchRecipes } from "../../features/recipes/recipesSlice";
import { RouteComponentProps } from "react-router-dom";
import { routes } from "./routes";

const Router: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, void, AnyAction>>();

  const [reader] = useAsyncResource(async () => {
    const customersPromise = dispatch(fetchCustomers());
    const exclusionsPromise = dispatch(fetchExclusions());
    const recipesPromise = dispatch(fetchRecipes());
    return Promise.all([exclusionsPromise, customersPromise, recipesPromise]);
  }, [] as never[]);

  return (
    <React.Suspense
      fallback={
        <Box alignSelf="center" pad={{ vertical: "large" }}>
          <Spinning size="large" />
        </Box>
      }
    >
      {Object.entries(routes).map(([path, { exact, anonymous, importFn }]) => (
        <TnmRoute
          exact={exact}
          key={`${path}-route`}
          dataReader={reader}
          path={path}
          groups={
            anonymous ? ["anonymous", "user", "admin"] : ["user", "admin"]
          }
          component={React.lazy<React.FC<RouteComponentProps>>(importFn)}
        />
      ))}
    </React.Suspense>
  );
};

export default Router;
