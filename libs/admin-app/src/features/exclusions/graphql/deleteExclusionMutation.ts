const deleteExclusionMutation = `
mutation DeleteExclusionMutation($input: DeleteExclusionInput!) {
  deleteExclusion(input: $input)
}
`;

export default deleteExclusionMutation;
