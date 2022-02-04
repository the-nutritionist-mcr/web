import * as database from '../backend/database';
import log from 'loglevel';

const clearTable = async (table: string): Promise<void> => {
  log.info(`Clearing table '${table}'`);
  const itemsToDelete = await database.getAll<{ id: string }>(table);
  const deleteParams = itemsToDelete.map((item) => ({ table, id: item.id }));
  await database.deleteAll(deleteParams);
};

export default clearTable;
