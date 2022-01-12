const updateRecipeMutation = `
mutation UpdateRecipeMutation($input: UpdateRecipeInput!) {
  updateRecipe(input: $input) {
    potentialExclusions {
      allergen
      id
      name
    }
  }
}
`;

export default updateRecipeMutation;
