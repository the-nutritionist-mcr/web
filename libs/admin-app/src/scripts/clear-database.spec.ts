import * as fs from 'fs-extra';
import clearDatabaseTables, {
  TRYING_TO_CLEAR_PROD_TABLES_ERROR,
} from './clear-database';
import clearTable from './clear-table';
import execa from 'execa';
import { mocked } from 'jest-mock';

jest.mock('./clear-table');

describe('ClearDatabaseTables', () => {
  const oldCwd = process.cwd();
  let tempDir: string | undefined;

  beforeEach(async () => {
    const { stdout } = await execa.command('mktemp -d');
    process.chdir(stdout);
    tempDir = stdout;
  });

  afterEach(async () => {
    await execa.command(`rm -rf ${tempDir}`);
    process.chdir(oldCwd);
  });

  it('Rejects the promise if the file is not found', async () => {
    await expect(clearDatabaseTables('./file.json')).rejects.toThrow(
      new Error('Outputs file was not present')
    );
  });

  it('Rejects the promise if file is not valid JSON', async () => {
    await fs.writeFile('./file.json', 'asdads;a\n');
    await expect(clearDatabaseTables('./file.json')).rejects.toThrow(
      new Error('Outputs file was not valid JSON')
    );
  });

  it("Rejects the promise if any of the table names contains 'prod'", async () => {
    const outputs = `
    {
      "DevBackendStackdev": {
        "GraphQlQpiUrl": "foo",
        "RecipesTableName": "prod-recipes-table",
        "RecipeExclusionsTableName": "recipe-exclusions-table",
        "UserPoolId": "bip",
        "ExclusionsTableName": "exclusions-table",
        "AuthUrl": "baz",
        "CustomersTableName": "customers-table",
        "ClientId": "bof",
        "RedirectUrl": "bong",
        "CustomerExclusionsTableName": "customer-exclusions-table"
      }
    }
    `;
    await fs.writeFile('./file.json', outputs);

    await expect(clearDatabaseTables('./file.json')).rejects.toThrow(
      new Error(TRYING_TO_CLEAR_PROD_TABLES_ERROR)
    );
  });

  it("Rejects the promise if the stack keyname contains 'prod'", async () => {
    const outputs = `
    {
      "ProdBackendStackdev": {
        "GraphQlQpiUrl": "foo",
        "RecipesTableName": "recipes-table",
        "RecipeExclusionsTableName": "recipe-exclusions-table",
        "UserPoolId": "bip",
        "ExclusionsTableName": "exclusions-table",
        "AuthUrl": "baz",
        "CustomersTableName": "customers-table",
        "ClientId": "bof",
        "RedirectUrl": "bong",
        "CustomerExclusionsTableName": "customer-exclusions-table"
      }
    }
    `;
    await fs.writeFile('./file.json', outputs);

    await expect(clearDatabaseTables('./file.json')).rejects.toThrow(
      new Error(TRYING_TO_CLEAR_PROD_TABLES_ERROR)
    );
  });

  it("Calls 'clearTable' for any output with a name ending in TableName", async () => {
    const outputs = `
    {
      "DevBackendStackdev": {
        "GraphQlQpiUrl": "foo",
        "RecipesTableName": "recipes-table",
        "RecipeExclusionsTableName": "recipe-exclusions-table",
        "UserPoolId": "bip",
        "ExclusionsTableName": "exclusions-table",
        "AuthUrl": "baz",
        "CustomersTableName": "customers-table",
        "ClientId": "bof",
        "RedirectUrl": "bong",
        "CustomerExclusionsTableName": "customer-exclusions-table"
      }
    }
    `;

    await fs.writeFile('./file.json', outputs);
    await clearDatabaseTables('./file.json');
    expect(mocked(clearTable, true)).toHaveBeenCalledTimes(5);
    expect(mocked(clearTable, true)).toHaveBeenCalledWith('recipes-table');
    expect(mocked(clearTable, true)).toHaveBeenCalledWith(
      'recipe-exclusions-table'
    );
    expect(mocked(clearTable, true)).toHaveBeenCalledWith('exclusions-table');
    expect(mocked(clearTable, true)).toHaveBeenCalledWith('customers-table');
    expect(mocked(clearTable, true)).toHaveBeenCalledWith(
      'customer-exclusions-table'
    );
  });
});
