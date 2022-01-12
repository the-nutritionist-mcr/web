import * as database from "./database";
import * as recipes from "./recipes";
import * as uuid from "uuid";
import {
  CreateRecipeMutationVariables,
  DeleteRecipeMutationVariables,
  RecipeExclusion,
  UpdateExclusionMutationVariables,
  UpdateRecipeMutationVariables,
} from "./query-variables-types";
import { resetAllWhenMocks, when } from "jest-when";
import { HotOrCold } from "../domain/Recipe";
import { mocked } from "ts-jest/utils";

jest.mock("./database");
jest.mock("uuid");

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  resetAllWhenMocks();
  delete process.env.RECIPES_TABLE;
  delete process.env.EXCLUSIONS_TABLE;
  delete process.env.RECIPE_EXCLUSIONS_TABLE;
});

describe("listRecipes", () => {
  it("Rejects the promise if RECIPES_TABLE is not set", async () => {
    process.env.EXCLUSIONS_TABLE = "bar";
    await expect(recipes.listRecipes()).rejects.toThrow(
      new Error("process.env.RECIPES_TABLE not set")
    );
  });

  it("Rejects the promise if EXCLUSIONS_TABLE is not set", async () => {
    process.env.RECIPES_TABLE = "foo";
    await expect(recipes.listRecipes()).rejects.toThrow(
      new Error("process.env.EXCLUSIONS_TABLE not set")
    );
  });

  it("Given that getAll returns recipes without exclusions, it just returns them", async () => {
    process.env.RECIPES_TABLE = "recipes-table";
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    process.env.RECIPE_EXCLUSIONS_TABLE = "recipe-exclusions-table";

    const mockRecipes: UpdateRecipeMutationVariables["input"][] = [
      {
        id: "0",
        name: "foo",
        shortName: "f",
        hotOrCold: HotOrCold.Hot,

        description: "bar",
        exclusionIds: [],
      },

      {
        id: "1",
        name: "baz",
        exclusionIds: [],
        shortName: "b",
        hotOrCold: HotOrCold.Hot,
      },

      {
        id: "2",
        name: "bap",
        exclusionIds: [],
        shortName: "ba",
        hotOrCold: HotOrCold.Hot,
      },
    ];

    when(mocked(database.getAllByIds, true))
      .calledWith("recipe-exclusions-table", expect.anything())
      .mockResolvedValue([]);

    when(mocked(database.getAllByIds, true))
      .calledWith("exclusions-table", expect.anything())
      .mockResolvedValue([]);

    when(mocked(database.getAll, true))
      .calledWith("recipes-table")
      .mockResolvedValue(mockRecipes);

    const result = await recipes.listRecipes();
    expect(result).toBeTruthy();
    expect(result).toHaveLength(3);
    expect(result[1].potentialExclusions).toHaveLength(0);
    expect(
      (result as unknown as Record<string, unknown>)["exclusionIds"]
    ).not.toBeDefined();
  });

  it("Given getAll returns recipes with exclusions, it merges them", async () => {
    process.env.RECIPES_TABLE = "recipes-table";
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    process.env.RECIPE_EXCLUSIONS_TABLE = "recipe-exclusions-table";

    const mockExclusions: UpdateExclusionMutationVariables["input"][] = [
      {
        id: "1",
        name: "foo",
        allergen: true,
      },
      {
        id: "2",
        name: "bar",
        allergen: false,
      },
      {
        id: "3",
        name: "baz",
        allergen: false,
      },
      {
        id: "4",
        name: "bap",
        allergen: false,
      },
    ];

    const recipeExclusions: RecipeExclusion[] = [
      {
        id: "8",
        recipeId: "0",
        exclusionId: "1",
      },
      {
        id: "10",
        exclusionId: "3",
        recipeId: "0",
      },
      {
        id: "15",
        exclusionId: "4",
        recipeId: "0",
      },
      {
        id: "21",
        exclusionId: "1",
        recipeId: "0",
      },
    ];

    const mockRecipes: UpdateRecipeMutationVariables["input"][] = [
      {
        id: "0",
        name: "lovely",
        description: "nice",
        exclusionIds: ["8", "10"],
        shortName: "l",
        hotOrCold: HotOrCold.Hot,
      },

      {
        id: "1",
        name: "james",
        exclusionIds: ["15", "21"],
        shortName: "j",
        hotOrCold: HotOrCold.Hot,
      },

      {
        id: "2",
        shortName: "f",
        hotOrCold: HotOrCold.Hot,
        name: "Alex",
        exclusionIds: [],
      },
    ];

    when(mocked(database.getAll, true))
      .calledWith("recipes-table")
      .mockResolvedValue(mockRecipes);

    when(mocked(database.getAllByIds, true))
      .calledWith(
        "recipe-exclusions-table",
        expect.arrayContaining(["8", "10", "15", "21"])
      )
      .mockResolvedValue(
        recipeExclusions as unknown as Record<string, unknown>[]
      );

    when(mocked(database.getAllByIds, true))
      .calledWith("exclusions-table", expect.arrayContaining(["1", "3", "4"]))
      .mockResolvedValue(
        mockExclusions as unknown as Record<string, unknown>[]
      );

    const result = await recipes.listRecipes();
    expect(result).toBeTruthy();
    expect(result).toHaveLength(3);
    expect(result[0].potentialExclusions).toHaveLength(2);
    expect(result[1].potentialExclusions[1].name).toEqual("foo");
  });
});

describe("Createrecipe", () => {
  it("Calls putAll with the recipe and the expected recipeExclusions if there is some and returns it", async () => {
    let called = 0;

    mocked(uuid.v4).mockImplementation(() => {
      called++;
      return `called-${called}`;
    });

    const mockExclusions: UpdateExclusionMutationVariables["input"][] = [
      {
        id: "3",
        name: "baz",
        allergen: false,
      },
      {
        id: "4",
        name: "bap",
        allergen: false,
      },
    ];

    process.env.RECIPES_TABLE = "recipes-table";
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    process.env.RECIPE_EXCLUSIONS_TABLE = "recipe-exclusions-table";
    const recipe: CreateRecipeMutationVariables["input"] = {
      name: "sausage",
      hotOrCold: HotOrCold.Hot,
      shortName: "fo",
      exclusionIds: ["4", "3"],
    };

    when(mocked(database.getAllByIds, true))
      .calledWith("exclusions-table", expect.arrayContaining(["4", "3"]))
      .mockResolvedValue(
        mockExclusions as unknown as Record<string, unknown>[]
      );

    const returnedRecipe = await recipes.createRecipe(recipe);
    expect(mocked(database.putAll, true)).toHaveBeenCalledWith([
      {
        table: "recipes-table",
        record: {
          id: "called-1",
          name: "sausage",
          hotOrCold: HotOrCold.Hot,
          shortName: "fo",
          exclusionIds: ["called-2", "called-3"],
        },
      },
      {
        table: "recipe-exclusions-table",
        record: {
          id: "called-2",
          recipeId: "called-1",
          exclusionId: "3",
        },
      },
      {
        table: "recipe-exclusions-table",
        record: {
          id: "called-3",
          recipeId: "called-1",
          exclusionId: "4",
        },
      },
    ]);

    expect(returnedRecipe).toBeTruthy();
    expect(returnedRecipe.id).toEqual("called-1");
    expect(returnedRecipe.name).toEqual("sausage");
    expect(returnedRecipe.potentialExclusions).toBeTruthy();
    expect(returnedRecipe.potentialExclusions[0].name).toEqual("baz");
    expect(returnedRecipe.potentialExclusions[1].name).toEqual("bap");
  });

  it("Calls putAll with the recipe if there is no exclusions and returns it", async () => {
    process.env.RECIPES_TABLE = "recipes-table";
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    process.env.RECIPE_EXCLUSIONS_TABLE = "recipe-exclusions-table";
    const recipe: CreateRecipeMutationVariables["input"] = {
      hotOrCold: HotOrCold.Hot,
      shortName: "f",
      name: "fish",
      exclusionIds: [],
    };

    when(mocked(database.getAllByIds, true))
      .calledWith("exclusions-table", expect.arrayContaining([]))
      .mockResolvedValue([]);

    mocked(uuid.v4).mockReturnValue("the-id");
    const returnedRecipe = await recipes.createRecipe(recipe);
    expect(mocked(database.putAll, true)).toHaveBeenCalledWith([
      {
        table: "recipes-table",
        record: {
          hotOrCold: HotOrCold.Hot,
          shortName: "f",
          id: "the-id",
          name: "fish",
          exclusionIds: [],
        },
      },
    ]);

    expect(returnedRecipe).toBeTruthy();
    expect(returnedRecipe.id).toEqual("the-id");
    expect(returnedRecipe.name).toEqual("fish");
  });

  it("Rejects the promise if RECIPES_TABLE is not set", async () => {
    process.env.EXCLUSIONS_TABLE = "bar";
    process.env.RECIPE_EXCLUSIONS_TABLE = "foo";
    await expect(
      recipes.createRecipe(
        {} as unknown as CreateRecipeMutationVariables["input"]
      )
    ).rejects.toThrow(new Error("process.env.RECIPES_TABLE not set"));
  });

  it("Rejects the promise if RECIPE_EXCLUSIONS_TABLE is not set", async () => {
    process.env.EXCLUSIONS_TABLE = "bar";
    process.env.RECIPES_TABLE = "foo";
    await expect(
      recipes.createRecipe(
        {} as unknown as CreateRecipeMutationVariables["input"]
      )
    ).rejects.toThrow(new Error("process.env.RECIPE_EXCLUSIONS_TABLE not set"));
  });

  it("Rejects the promise if EXCLUSIONS_TABLE is not set", async () => {
    process.env.RECIPE_EXCLUSIONS_TABLE = "foo";
    process.env.RECIPES_TABLE = "foo";
    await expect(
      recipes.createRecipe(
        {} as unknown as CreateRecipeMutationVariables["input"]
      )
    ).rejects.toThrow(new Error("process.env.EXCLUSIONS_TABLE not set"));
  });
});

describe("Update recipe", () => {
  it("Returns the changed recipe including merged exclusions", async () => {
    process.env.RECIPE_EXCLUSIONS_TABLE = "recipe-exclusions-table";
    process.env.RECIPES_TABLE = "recipes-table";
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    let called = 0;
    mocked(uuid.v4).mockImplementation(() => {
      called++;
      return `called-${called}`;
    });

    const mockExclusions: UpdateExclusionMutationVariables["input"][] = [
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

    const recipeExclusions: RecipeExclusion[] = [
      {
        id: "10",
        exclusionId: "3",
        recipeId: "0",
      },
      {
        id: "15",
        exclusionId: "2",
        recipeId: "0",
      },
    ];

    when(mocked(database.getAllByGsis, true))
      .calledWith(
        "recipe-exclusions-table",
        "recipeId",
        expect.arrayContaining(["0"])
      )
      .mockResolvedValue(
        recipeExclusions as unknown as Record<string, unknown>[]
      );

    when(mocked(database.getAllByIds, true))
      .calledWith("exclusions-table", expect.arrayContaining(["2", "3"]))
      .mockResolvedValue(
        mockExclusions as unknown as Record<string, unknown>[]
      );

    const input: UpdateRecipeMutationVariables["input"] = {
      id: "0",
      shortName: "foo",
      hotOrCold: HotOrCold.Hot,
      name: "foo-bar",
      exclusionIds: ["2", "3"],
    };
    const recipe = await recipes.updateRecipe(input);

    expect(recipe).toBeDefined();
    if (recipe) {
      expect(recipe.name).toEqual("foo-bar");
      expect(
        (recipe as unknown as UpdateRecipeMutationVariables["input"])
          .exclusionIds
      ).toBeUndefined();
      expect(recipe.potentialExclusions).toHaveLength(2);
      expect(recipe.potentialExclusions[0].name).toEqual("baz");
    }
  });

  it("Updates the recipe if there are no exclusions to be changed", async () => {
    process.env.RECIPE_EXCLUSIONS_TABLE = "recipe-exclusions-table";
    process.env.EXCLUSIONS_TABLE = "exclusions-table";
    process.env.RECIPES_TABLE = "recipes-table";
    let called = 0;
    mocked(uuid.v4).mockImplementation(() => {
      called++;
      return `called-${called}`;
    });

    const recipeExclusions: RecipeExclusion[] = [
      {
        id: "10",
        exclusionId: "3",
        recipeId: "0",
      },
      {
        id: "15",
        exclusionId: "2",
        recipeId: "0",
      },
    ];

    when(mocked(database.getAllByGsis, true))
      .calledWith(
        "recipe-exclusions-table",
        "recipeId",
        expect.arrayContaining(["0"])
      )
      .mockResolvedValue(
        recipeExclusions as unknown as Record<string, unknown>[]
      );

    const input: UpdateRecipeMutationVariables["input"] = {
      hotOrCold: HotOrCold.Hot,
      shortName: "foo",
      id: "0",
      name: "foobar",
      exclusionIds: ["2", "3"],
    };
    await recipes.updateRecipe(input);

    expect(database.deleteAll).toHaveBeenCalledWith([]);
    expect(database.putAll).toHaveBeenCalledWith([]);

    const toInsert = {
      ...input,
      exclusionIds: expect.arrayContaining(["15", "10"]),
    };

    expect(database.updateById).toHaveBeenCalledWith(
      "recipes-table",
      "0",
      toInsert
    );
  });

  it("Updates the recipe and removes exclusions if some need to be removed", async () => {
    process.env.RECIPE_EXCLUSIONS_TABLE = "recipe-exclusions-table";
    process.env.EXCLUSIONS_TABLE = "recipes-table";
    process.env.RECIPES_TABLE = "recipes-table";
    let called = 0;
    mocked(uuid.v4).mockImplementation(() => {
      called++;
      return `called-${called}`;
    });

    const recipeExclusions: RecipeExclusion[] = [
      {
        id: "8",
        recipeId: "0",
        exclusionId: "0",
      },
      {
        id: "10",
        exclusionId: "3",
        recipeId: "0",
      },
      {
        id: "15",
        exclusionId: "2",
        recipeId: "0",
      },
    ];

    when(mocked(database.getAllByGsis, true))
      .calledWith(
        "recipe-exclusions-table",
        "recipeId",
        expect.arrayContaining(["0"])
      )
      .mockResolvedValue(
        recipeExclusions as unknown as Record<string, unknown>[]
      );

    const input: UpdateRecipeMutationVariables["input"] = {
      id: "0",
      name: "baz",
      hotOrCold: HotOrCold.Hot,
      shortName: "ba",
      description: "fat",
      exclusionIds: ["2"],
    };
    await recipes.updateRecipe(input);

    expect(database.deleteAll).toHaveBeenCalledWith(
      expect.arrayContaining([
        {
          table: "recipe-exclusions-table",
          id: "10",
        },
        {
          table: "recipe-exclusions-table",
          id: "8",
        },
      ])
    );

    const toInsert = {
      ...input,
      exclusionIds: ["15"],
    };

    expect(database.updateById).toHaveBeenCalledWith(
      "recipes-table",
      "0",
      toInsert
    );
  });

  it("Updates the recipe and adds exclusions if some need to be added", async () => {
    process.env.RECIPE_EXCLUSIONS_TABLE = "recipe-exclusions-table";
    process.env.RECIPES_TABLE = "recipes-table";
    process.env.EXCLUSIONS_TABLE = "recipes-table";
    let called = 0;
    mocked(uuid.v4).mockImplementation(() => {
      called++;
      return `called-${called}`;
    });

    const recipeExclusions: RecipeExclusion[] = [
      {
        id: "10",
        exclusionId: "3",
        recipeId: "0",
      },
      {
        id: "15",
        exclusionId: "2",
        recipeId: "0",
      },
    ];

    when(mocked(database.getAllByGsis, true))
      .calledWith(
        "recipe-exclusions-table",
        "recipeId",
        expect.arrayContaining(["0"])
      )
      .mockResolvedValue(
        recipeExclusions as unknown as Record<string, unknown>[]
      );

    const input: UpdateRecipeMutationVariables["input"] = {
      id: "0",
      name: "a-recipe",
      hotOrCold: HotOrCold.Hot,
      shortName: "blah",
      exclusionIds: ["2", "3", "4"],
    };

    const inDataBase: UpdateRecipeMutationVariables["input"] = {
      id: "0",
      name: "the-recipe",
      hotOrCold: HotOrCold.Hot,
      shortName: "the",
      exclusionIds: ["10", "15"],
    };

    await recipes.updateRecipe(input);

    expect(database.putAll).toHaveBeenCalledWith([
      {
        table: "recipe-exclusions-table",
        record: {
          id: "called-1",
          exclusionId: "4",
          recipeId: "0",
        },
      },
    ]);

    const toInsert = {
      ...input,
      exclusionIds: [...inDataBase.exclusionIds, "called-1"],
    };

    expect(database.updateById).toHaveBeenCalledWith(
      "recipes-table",
      "0",
      toInsert
    );
  });
});

describe("Delete recipe", () => {
  it("Rejects the promise if RECIPES_TABLE is not set", async () => {
    process.env.RECIPE_EXCLUSIONS_TABLE = "foo";
    await expect(
      recipes.deleteRecipe(
        {} as unknown as DeleteRecipeMutationVariables["input"]
      )
    ).rejects.toThrow(new Error("process.env.RECIPES_TABLE not set"));
  });

  it("Rejects the promise if RECIPE_EXCLUSIONS_TABLE is not set", async () => {
    process.env.RECIPES_TABLE = "foo";
    await expect(
      recipes.deleteRecipe(
        {} as unknown as DeleteRecipeMutationVariables["input"]
      )
    ).rejects.toThrow(new Error("process.env.RECIPE_EXCLUSIONS_TABLE not set"));
  });

  it("Calls deleteall with the id of the recipe and any assocated recipe exclusions", async () => {
    process.env.RECIPE_EXCLUSIONS_TABLE = "recipe-exclusions-table";
    process.env.RECIPES_TABLE = "recipes-table";

    const recipe: UpdateRecipeMutationVariables["input"] = {
      id: "0",
      name: "foo",
      hotOrCold: HotOrCold.Hot,
      shortName: "f",
      exclusionIds: ["8", "10"],
    };

    when(mocked(database.getAllByIds))
      .calledWith("recipes-table", ["0"])
      .mockResolvedValue([recipe]);

    await recipes.deleteRecipe({ id: "0" });

    expect(database.deleteAll).toHaveBeenCalledWith([
      {
        table: "recipes-table",
        id: "0",
      },
      {
        table: "recipe-exclusions-table",
        id: "8",
      },
      {
        table: "recipe-exclusions-table",
        id: "10",
      },
    ]);
  });
});
