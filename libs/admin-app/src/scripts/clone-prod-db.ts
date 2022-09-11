// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { copy } from 'copy-dynamodb-table';

const doCopy = async (sourceEnv: string, destinationEnv: string) => {
  if (destinationEnv === 'prod') {
    throw new Error('You absolutely cannot use this tool to clone to prod');
  }

  return await Promise.resolve(
    [
      'recipes-table',
      'exclusions-table',
      'customers-table',
      'customer-exclusions-table',
      'recipe-exclusions-table',
    ].map(
      async (table) =>
        await new Promise((resolve, reject) => {
          copy(
            {
              config: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: 'eu-west-2',
              },
              source: {
                tableName: `${sourceEnv}-tnm-admin-${table}`,
              },
              destination: {
                tableName: `${destinationEnv}-tnm-admin-${table}`,
              },
              log: true,
              create: false,
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error: Error | null, result: any) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
        })
    )
  );
};

doCopy('prod', 'dev').catch((error: Error) => {
  // eslint-disable-next-line no-console
  console.log(error);
});
