const deleteInput: AdminDeleteUserCommandInput = {
  UserPoolId: 'test-pool-id',
  Username: 'foo'
};

const deleteCommandCall = cognitoMock.commandCalls(
  // TODO raise bug report on aws-sdk-client-mock repo for this type error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AdminDeleteUserCommand as any,
  deleteInput
);

expect(deleteCommandCall).toHaveLength(1);

const deleteInputTwo: AdminDeleteUserCommandInput = {
  UserPoolId: 'test-pool-id',
  Username: 'foo-two'
};

const deleteCommandCall2 = cognitoMock.commandCalls(
  // TODO raise bug report on aws-sdk-client-mock repo for this type error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AdminDeleteUserCommand as any,
  deleteInputTwo
);

expect(deleteCommandCall2).toHaveLength(1);
