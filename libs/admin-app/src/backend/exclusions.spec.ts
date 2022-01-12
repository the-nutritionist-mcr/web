import * as database from "./database";
import * as exclusions from "./exclusions";
import * as uuid from "uuid";
import {
  CreateExclusionMutationVariables,
  UpdateExclusionMutationVariables,
} from "./query-variables-types";
import { resetAllWhenMocks, when } from "jest-when";
import Exclusion from "../domain/Exclusion";
import { mocked } from "ts-jest/utils";

jest.mock("./database");
jest.mock("uuid");

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  resetAllWhenMocks();
  delete process.env.EXCLUSIONS_TABLE;
});

describe("List exclusions", () => {
  it("Rejects the promise if EXCLUSIONS_TABLE is not set", async () => {
    await expect(exclusions.listExclusions()).rejects.toThrow(
      new Error("process.env.EXCLUSIONS_TABLE not set")
    );
  });

  it("Correctly returns exclusions acquired from getAll", async () => {
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    const mockExclusions: Exclusion[] = [
      {
        id: "2",
        name: "baz",
        allergen: false,
      },
      {
        id: "3",
        name: "bap",
        allergen: false,
      },
    ];

    when(mocked(database.getAll, true))
      .calledWith("exclusions-table")
      .mockResolvedValue(
        mockExclusions as unknown as Record<string, unknown>[]
      );

    const results = await exclusions.listExclusions();
    expect(results).toEqual(mockExclusions);
  });
});

describe("Create exclusion", () => {
  it("Calls putAll with the exclusion, then returns the exclusion with the correct ID", async () => {
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    mocked(uuid.v4).mockReturnValue("foo-id");
    const mockExclusion: CreateExclusionMutationVariables["input"] = {
      name: "baz",
      allergen: false,
    };

    const results = await exclusions.createExclusion(mockExclusion);

    expect(database.putAll).toHaveBeenCalledWith([
      {
        table: "exclusions-table",
        record: {
          ...mockExclusion,
          id: "foo-id",
        },
      },
    ]);

    expect(results).toBeDefined();
    expect(results.id).toEqual("foo-id");
    expect(results.name).toEqual("baz");
    expect(results.allergen).toEqual(false);
  });
});

describe("Update exclusion", () => {
  it("Calls updateById, then returns the updated exclusion", async () => {
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    const mockExclusion: UpdateExclusionMutationVariables["input"] = {
      id: "foo-id",
      name: "baz",
      allergen: false,
    };

    const results = await exclusions.updateExclusion(mockExclusion);

    expect(database.updateById).toHaveBeenCalledWith(
      "exclusions-table",
      "foo-id",
      mockExclusion
    );

    expect(results).toBeDefined();
    expect(results.id).toEqual("foo-id");
    expect(results.name).toEqual("baz");
    expect(results.allergen).toEqual(false);
  });
});

describe("Delete exclusion", () => {
  it("Calls deleteall, then returns the deleted id", async () => {
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    const returnedId = await exclusions.deleteExclusion({ id: "foo-id" });
    expect(database.deleteAll).toHaveBeenCalledWith([
      { table: "exclusions-table", id: "foo-id" },
    ]);
    expect(returnedId).toEqual("foo-id");
  });
});
