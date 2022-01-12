const deleteRecipeMutation = `
mutation DeleteRecipeMutation($input: DeleteRecipeInput!) {
  deleteRecipe(input: $input) 
}
`;

export default deleteRecipeMutation;
