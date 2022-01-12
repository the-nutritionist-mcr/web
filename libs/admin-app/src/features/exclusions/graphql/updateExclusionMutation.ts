const updateExclusionMutation = `
mutation UpdateExclusionMutation($input: UpdateExclusionInput!){
  updateExclusion(input: $input) {
    id
  }
}
`;

export default updateExclusionMutation;
