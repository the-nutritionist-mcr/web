const updateCustomerMutation = `
mutation UpdateCustomerMutation($input: UpdateCustomerInput!) {
  updateCustomer(input: $input) {
    exclusions {
      allergen
      id
      name
    }
  }
}
`;

export default updateCustomerMutation;
