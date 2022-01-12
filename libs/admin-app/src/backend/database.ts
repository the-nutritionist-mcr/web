import AWS from "aws-sdk";
import log from "loglevel";

const NUM_TABS = 4;

const TRANSACT_ITEMS_MAX_SIZE = 25;
const BATCH_GET_MAX_SIZE = 100;

export const getAll = async <T>(table: string): Promise<T[]> => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
  /* eslint-disable @typescript-eslint/naming-convention */
  const params = {
    TableName: table,
  };

  log.trace(JSON.stringify(params, null, NUM_TABS));
  const result = await dynamoDb.scan(params).promise();
  return (excludeDeleted(result.Items) as T[] | undefined) ?? [];
  /* eslint-enable @typescript-eslint/naming-convention */
};

const excludeDeleted = (
  items: AWS.DynamoDB.DocumentClient.ItemList | undefined
) => items?.filter((item) => !item.deleted);

export const getAllByGsis = async <T>(
  table: string,
  indexName: string,
  ids: string[]
): Promise<T[]> => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
  if (ids.length === 0) {
    return [];
  }
  const results = await Promise.all(
    ids.map(async (id) => {
      /* eslint-disable @typescript-eslint/naming-convention */
      const params = {
        TableName: table,
        IndexName: indexName,
        KeyConditionExpression: `${indexName} = :indexKey`,

        ExpressionAttributeValues: {
          ":indexKey": id,
        },
      };

      log.trace(JSON.stringify(params, null, NUM_TABS));
      return dynamoDb.query(params).promise();
    })
  );
  /* eslint-enable @typescript-eslint/naming-convention */

  return results.flatMap((item) => excludeDeleted(item.Items) ?? []) as T[];
};

export const getAllByIds = async <T>(
  table: string,
  ids: (string | { key: string; value: string })[]
): Promise<T[]> => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
  /* eslint-disable @typescript-eslint/naming-convention */
  if (ids.length === 0) {
    return [];
  }

  const batches = batchArray(ids, BATCH_GET_MAX_SIZE);

  const result = await Promise.all(
    batches.map(async (batch) => {
      const batchParams = {
        RequestItems: {
          [table]: {
            Keys: Array.from(new Set(batch), (id) =>
              typeof id === "string" ? { id } : { [id.key]: id.value }
            ),
          },
        },
      };

      log.trace(JSON.stringify(batchParams, null, NUM_TABS));

      const results = await dynamoDb.batchGet(batchParams).promise();

      return results.Responses
        ? (excludeDeleted(results.Responses[table]) as T[])
        : [];
    })
  );

  return result.flat();
};

export const putAll = async <T>(
  items: { table: string; record: T }[]
): Promise<void> => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
  if (items.length === 0) {
    return;
  }
  const batches = batchArray(items, TRANSACT_ITEMS_MAX_SIZE);

  await Promise.all(
    batches.map(async (batch) => {
      /* eslint-disable @typescript-eslint/naming-convention */
      const params = {
        TransactItems: batch.map((item) => ({
          Put: {
            TableName: item.table,
            Item: item.record,
          },
        })),
      };
      /* eslint-enable @typescript-eslint/naming-convention */

      log.trace(JSON.stringify(params, null, NUM_TABS));

      await dynamoDb.transactWrite(params).promise();
    })
  );
};

export const updateById = async <T>(
  table: string,
  id: string,
  record: T
): Promise<void> => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
  /* eslint-disable @typescript-eslint/naming-convention */

  const params = {
    TableName: table,
    Key: {
      id,
    },
    Item: record,
  };
  /* eslint-enable @typescript-eslint/naming-convention */

  log.trace(JSON.stringify(params, null, NUM_TABS));
  await dynamoDb.put(params).promise();
};

const batchArray = <T>(input: T[], batchSize: number): T[][] =>
  input.reduce<T[][]>(
    (accumulator, item) => {
      if (accumulator[accumulator.length - 1].length === batchSize) {
        accumulator.push([]);
      }
      accumulator[accumulator.length - 1].push(item);
      return accumulator;
    },
    [[]]
  );

export const deleteAll = async (
  items: {
    table: string;
    id: string;
  }[]
): Promise<void> => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
  if (items.length === 0) {
    return;
  }

  const batches = batchArray(items, TRANSACT_ITEMS_MAX_SIZE);

  await Promise.all(
    batches.map(async (batch) => {
      /* eslint-disable @typescript-eslint/naming-convention */
      const params = {
        TransactItems: batch.map((item) => ({
          Update: {
            TableName: item.table,
            UpdateExpression: "SET deleted = :newvalue",
            ExpressionAttributeValues: { ":newvalue": true },
            Key: {
              id: item.id,
            },
          },
        })),
      };

      /* eslint-enable @typescript-eslint/naming-convention */
      log.trace(JSON.stringify(params, null, NUM_TABS));

      await dynamoDb.transactWrite(params).promise();
    })
  );
};
