import * as fs from 'fs-extra';
import clearTable from './clear-table';
import hasKey from '../lib/hasKey';

export const TRYING_TO_CLEAR_PROD_TABLES_ERROR =
  "You are trying to clear production data tables. You don't want to do that!";

const clearDatabaseTables = async (outputs: string) => {
  try {
    const config = await fs.readJson(outputs);
    const stackKey = Object.keys(config)[0];

    if (stackKey.toLowerCase().includes('prod')) {
      throw new Error(TRYING_TO_CLEAR_PROD_TABLES_ERROR);
    }
    if (!hasKey(config, stackKey)) {
      throw new Error(`${config} doesn't have key ${stackKey}`);
    }

    const stackObj = config[stackKey];
    const tables = Object.keys(stackObj)
      .filter((key) => key.endsWith('TableName'))
      .map((tableKey) => stackObj[tableKey]);

    if (tables.some((table) => table.toLowerCase().includes('prod'))) {
      throw new Error(TRYING_TO_CLEAR_PROD_TABLES_ERROR);
    }

    await Promise.all(tables.map((tableName) => clearTable(tableName)));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith('ENOENT')) {
        throw new Error('Outputs file was not present');
      }
      if (error.message.includes('Unexpected token')) {
        throw new Error('Outputs file was not valid JSON');
      }
    }

    throw error;
  }
};

export default clearDatabaseTables;
