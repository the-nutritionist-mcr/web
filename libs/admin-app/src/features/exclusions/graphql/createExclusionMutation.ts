const createExclusionMutation = `
mutation CreateExclusionMutation($input: ExclusionInput!) {
  createExclusion(input: $input) {
    id
  }
}
`;

export default createExclusionMutation;
