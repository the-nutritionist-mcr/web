import { Builder } from '@sls-next/lambda-at-edge';

const builder = new Builder('./apps/web-app', './dist/apps/web-app/sls-build', {
  cmd: 'yarn',
  args: ['nx', 'build', 'web-app'],
  cwd: process.cwd(),
});

console.log('building next application!');

builder
  .build()
  .then(() => console.log('Done!'))
  .catch((error) => console.log(error));
