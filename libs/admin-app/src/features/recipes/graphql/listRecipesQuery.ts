const listRecipesQuery = `
query ListRecipesQuery {
  listRecipes {
    description
    id
    name
    shortName
    hotOrCold
    invalidExclusions
    potentialExclusions {
      allergen
      id
      name
    }
  }
}
`;

export default listRecipesQuery;
