import React from 'react';

function assertFC<P>(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _component: React.FC<P>
  // eslint-disable-next-line @typescript-eslint/no-empty-function
): asserts _component is React.FC<P> {}

export default assertFC;
