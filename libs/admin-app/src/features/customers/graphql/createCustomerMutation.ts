const createCustomerMutation = `
mutation CreateCustomerMutation($input: CustomerInput!) {
  createCustomer(input: $input) {
    exclusions {
      allergen
      id
      name
    }
    id
  }
}
`;

export default createCustomerMutation;
