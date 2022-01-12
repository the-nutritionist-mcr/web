import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as database from "./database";

describe("The deleteAll method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("batches items into groups of 25 when passing them through to transactWrite", async () => {
    AWSMock.setSDKInstance(AWS);
    const paramsReceived: AWS.DynamoDB.TransactWriteItemsInput[] = [];
    AWSMock.mock(
      "DynamoDB.DocumentClient",
      "transactWrite",
      (
        params: AWS.DynamoDB.TransactWriteItemsInput,
        callback: (error: Error | undefined) => void
      ) => {
        paramsReceived.push(params);
        callback(undefined);
      }
    );

    const items = [
      { table: "foo-table", id: "0" },
      { table: "foo-table", id: "1" },
      { table: "foo-table", id: "2" },
      { table: "foo-table", id: "3" },
      { table: "foo-table", id: "4" },
      { table: "foo-table", id: "5" },
      { table: "foo-table", id: "6" },
      { table: "foo-table", id: "7" },
      { table: "foo-table", id: "8" },
      { table: "foo-table", id: "9" },
      { table: "foo-table", id: "10" },
      { table: "foo-table", id: "11" },
      { table: "foo-table", id: "12" },
      { table: "foo-table", id: "13" },
      { table: "foo-table", id: "14" },
      { table: "foo-table", id: "15" },
      { table: "foo-table", id: "16" },
      { table: "foo-table", id: "17" },
      { table: "foo-table", id: "18" },
      { table: "foo-table", id: "19" },
      { table: "foo-table", id: "20" },
      { table: "foo-table", id: "21" },
      { table: "foo-table", id: "22" },
      { table: "foo-table", id: "23" },
      { table: "foo-table", id: "24" },
      { table: "foo-table", id: "25" },
      { table: "foo-table", id: "26" },
      { table: "foo-table", id: "26" },
      { table: "foo-table", id: "27" },
      { table: "foo-table", id: "28" },
    ];

    await database.deleteAll(items);

    expect(paramsReceived).toHaveLength(2);
    expect(paramsReceived[0].TransactItems).toHaveLength(25);
    expect(paramsReceived[1].TransactItems).toHaveLength(5);
    expect(paramsReceived[0].TransactItems[24].Update?.Key.id).toEqual("24");
    expect(paramsReceived[1].TransactItems[0].Update?.Key.id).toEqual("25");
    expect(paramsReceived[1].TransactItems[4].Update?.Key.id).toEqual("28");
  });
});
