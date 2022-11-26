// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

import addContext from 'mochawesome/addContext';

Cypress.on('test:after:run', (test, runnable) => {
  // eslint-disable-next-line fp/no-let
  let videoName = Cypress.spec.name;
  videoName = videoName.replace('/.js.*', '.js');
  const videoUrl = 'videos/' + videoName + '.mp4';

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  addContext({ test }, videoUrl);
});
