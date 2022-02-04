import React from 'react';

export type DynamicComponent = Promise<{
  default: React.FC<LoadableRouteProps>;
}>;

export default interface LoadableRoute {
  readonly sortKey: number;
  readonly name: string;
  readonly icon: React.ElementType;
  readonly path?: string;
  readonly exact?: boolean;
  readonly groups: string[];
  loadingRoute?: DynamicComponent;
  loadedRoute?: React.FC<LoadableRouteProps>;
  readonly loadRoute: () => DynamicComponent;
}

export interface LoadableRouteProps {
  name: string;
}
