import { Logger } from 'tslog';

const minLevel =
  process.env.LOG_LEVEL ?? process.env.NODE_ENV === 'production'
    ? 'info'
    : 'silly';

const type = process.env.NODE_ENV === 'production' ? 'json' : 'pretty';

export const logger = new Logger({ minLevel, type });
