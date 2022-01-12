const listExclusionsQuery = `
query ListExclusions {
  listExclusions {
    allergen
    id
    name
  }
}
`;

export default listExclusionsQuery;
