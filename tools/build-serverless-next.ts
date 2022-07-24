import { Builder } from '@sls-next/lambda-at-edge';

import path from 'node:path';

// eslint-disable-next-line unicorn/prefer-module
const dirname = __dirname;

const root = path.join(dirname, '..');
const dist = path.join(root, 'dist');
const nextConfigDir = path.join(dist, 'apps', 'web-app');
const nextJsBuildDir = path.join(dist, 'apps', 'web-app', 'serverless');

const builder = new Builder(nextConfigDir, nextJsBuildDir, {
  cmd: 'true',
  cwd: root,
  cleanupDotNext: false,
});

builder
  .build(true)
  .then(() => console.log('Done!'))
  .catch((error) => console.log(error));
