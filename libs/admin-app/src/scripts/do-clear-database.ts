import clearDatabaseTables from './clear-database';
import log from 'loglevel';
import path from 'node:path';

log.setDefaultLevel('info');

// eslint-disable-next-line unicorn/prefer-module
const outputs = path.resolve(__dirname, '..', 'backend-outputs.json');
clearDatabaseTables(outputs);
