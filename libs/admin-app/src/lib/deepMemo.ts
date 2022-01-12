import React from 'react';

import deepEqual from 'deep-equal';

const deepMemo = <T>(component: React.FC<T>): ReturnType<typeof React.memo> =>
  // TODO this was fine in the old app but is now failing type checking
  // when I bring it across to the new repo. really should remove this
  // ts-ignore comment but putting it for the sake of migrating quickly
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  React.memo(component, (oldProps, newProps) => deepEqual(oldProps, newProps));

export default deepMemo;
