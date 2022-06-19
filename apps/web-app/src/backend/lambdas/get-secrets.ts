import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandInput,
} from '@aws-sdk/client-secrets-manager'; // ES Modules import

const client = new SecretsManagerClient({});

export const getSecrets = (...secretNames: string[]) =>
  secretNames.map(async (secret) => {
    const input: GetSecretValueCommandInput = {
      SecretId: secret,
    };

    const response = await client.send(new GetSecretValueCommand(input));

    return response.SecretString;
  });
