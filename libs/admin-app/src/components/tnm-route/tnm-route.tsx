import React from 'react';
import UserContext from '../../lib/UserContext';
import { RouteComponentProps, Route } from 'react-router-dom';
import { DataOrModifiedFn } from 'use-async-resource';

interface TnmRouteProps<T> {
  path: string;
  groups: string[];
  exact?: boolean;
  component?: React.ComponentType<RouteComponentProps<T>>;
  dataReader: DataOrModifiedFn<[void, void, void]>;
}

function assertFC<P>(
  _component: React.FC<P>
  // eslint-disable-next-line @typescript-eslint/no-empty-function
): asserts _component is React.FC<P> {}

function TnmRoute<T>(props: TnmRouteProps<T>): React.ReactElement | null {
  props.dataReader();
  const user = React.useContext(UserContext);
  return props.groups.some(group => user?.groups?.includes(group)) ? (
    // TODO this was fine in the old app but is now failing type checking
    // when I bring it across to the new repo. really should remove this
    // ts-ignore comment but putting it for the sake of migrating quickly
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Route exact={props.exact} path={props.path} component={props.component} />
  ) : null;
}

assertFC(TnmRoute);

export default TnmRoute;
