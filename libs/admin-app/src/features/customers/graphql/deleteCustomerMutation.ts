const deleteCustomerMutation = `
mutation DeleteCustomerMutation($input: DeleteCustomerInput!) {
  deleteCustomer(input: $input) 
}
`;

export default deleteCustomerMutation;
