import React from 'react';

import deepEqual from 'deep-equal';

const deepMemo = <T>(component: React.FC<T>) =>
  React.memo(component, (oldProps, newProps) => deepEqual(oldProps, newProps));

export default deepMemo;
