import randomString from 'randomstring';
import { authoriseJwt } from '../data-api/authorise';
import { returnOkResponse } from '../data-api/return-ok-response';
import { returnErrorResponse } from '../data-api/return-error-response';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminSetUserPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  SendEmailCommand,
  SendEmailCommandInput,
  SESClient,
} from '@aws-sdk/client-ses';
import { getUserFromAws } from '../../../utils/get-user-from-aws';
import { makeEmail } from '../chargebee-api/portal-welcome-email';
import { getDomainName } from '@tnmw/utils';
import { warmer } from './warmer';

export interface ResetPassswordPayload {
  username: string;
  newPassword?: string;
  forceChange?: boolean;
}

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    const { authenticated } = await authoriseJwt(event, ['admin'], {
      allowUnauthenticated: true,
    });

    const body = JSON.parse(event.body ?? '{}');

    const user = await getUserFromAws(body.username);

    const cognito = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });

    const password = authenticated
      ? body.newPassword
      : randomString.generate(8);

    const forceChange = authenticated ? body.forceChange : true;

    const ses = new SESClient({});

    const command = new AdminSetUserPasswordCommand({
      UserPoolId: process.env.COGNITO_POOL_ID,
      Username: body.username,
      Password: password,
      Permanent: !forceChange,
    });

    await cognito.send(command);

    const domainName = getDomainName(process.env.ENVIRONMENT_NAME ?? '');

    const email: SendEmailCommandInput = {
      Destination: {
        ToAddresses: [user.email],
      },
      Message: {
        Body: {
          Html: {
            // eslint-disable-next-line unicorn/text-encoding-identifier-case
            Charset: 'UTF-8',
            Data: makeEmail(
              user.firstName,
              user.username ?? '',
              body.newPassword,
              `https://${domainName}`
            ),
          },
        },
        Subject: {
          // eslint-disable-next-line unicorn/text-encoding-identifier-case
          Charset: 'UTF-8',
          Data: 'Welcome to your personal Members Area',
        },
      },
      Source: 'no-reply@thenutritionistmcr.com',
    };

    const sendEmailCommand = new SendEmailCommand(email);

    await ses.send(sendEmailCommand);

    return returnOkResponse({});
  } catch (error) {
    if (error instanceof Error) {
      return returnErrorResponse(error);
    }
    return returnErrorResponse();
  }
});
