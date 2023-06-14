import randomString from 'randomstring';
import { authoriseJwt } from '../data-api/authorise';
import { returnOkResponse } from '../data-api/return-ok-response';
import { returnErrorResponse } from '../data-api/return-error-response';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminSetUserPasswordCommand,
  ListUsersCommand,
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
import { HttpError } from '../data-api/http-error';
import { HTTP } from '@tnmw/constants';

export interface ResetPassswordPayload {
  username: string;
  generateNew?: boolean;
  newPassword?: string;
  forceChange?: boolean;
}

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    const { authenticated } = await authoriseJwt(event, ['admin'], {
      allowUnauthenticated: true,
    });

    const body = JSON.parse(event.body ?? '{}');

    const cognito = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });

    const getUsernameFromEmail = async (email: string): Promise<string> => {
      const params = {
        UserPoolId: process.env['COGNITO_POOL_ID'],
        Limit: 1,
        // eslint-disable-next-line no-useless-escape
        Filter: `email ^= \"${email.trim()}\"`,
      };

      const command = new ListUsersCommand(params);

      const response = await cognito.send(command);

      if (!response.Users || response.Users?.length !== 1) {
        throw new HttpError(
          HTTP.statusCodes.BadRequest,
          `User with email ${email} was not found`
        );
      }

      return response.Users[0].Username ?? '';
    };

    const username = authenticated
      ? body.username
      : await getUsernameFromEmail(body.username);

    const password = !body.generateNew
      ? body.newPassword
      : randomString.generate(8);

    const user = await getUserFromAws(username);

    const forceChange = authenticated ? body.forceChange : true;

    const ses = new SESClient({});

    const command = new AdminSetUserPasswordCommand({
      UserPoolId: process.env.COGNITO_POOL_ID,
      Username: username,
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
              password,
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
