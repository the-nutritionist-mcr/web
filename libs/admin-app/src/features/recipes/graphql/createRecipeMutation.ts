const createRecipeMutation = `
mutation CreateRecipeMutation($input: RecipeInput!) {
  createRecipe(input: $input) {
    potentialExclusions {
      allergen
      id
      name
    }
    id
  }
}
`;

export default createRecipeMutation;
