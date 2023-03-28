import '../misc/init-dd-trace';
import { getDomainName } from '@tnmw/utils';
import {
  CustomMessageAdminCreateUserTriggerEvent,
  CustomMessageForgotPasswordTriggerEvent,
  Handler,
} from 'aws-lambda';
import { makeEmail } from './portal-welcome-email';

export const handler: Handler<
  | CustomMessageAdminCreateUserTriggerEvent
  | CustomMessageForgotPasswordTriggerEvent
> = async (event) => {
  if (
    event.triggerSource === 'CustomMessage_AdminCreateUser' ||
    event.triggerSource === 'CustomMessage_ForgotPassword'
  ) {
    const domainName = getDomainName(process.env.ENVIRONMENT ?? '');
    event.response = {
      smsMessage: `TNM Invite`,
      emailSubject: 'Welcome to your personal Members Area',
      emailMessage: makeEmail(
        event.request.userAttributes.given_name,
        event.request.usernameParameter ?? '',
        event.request.codeParameter,
        `https://${domainName}`
      ),
    };
  }

  console.log(event.response);

  return event;
};
