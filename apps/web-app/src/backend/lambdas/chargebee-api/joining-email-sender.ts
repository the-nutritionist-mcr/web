import { CustomMessageAdminCreateUserTriggerEvent, Handler } from 'aws-lambda';
import { makeEmail } from './portal-welcome-email';

export const handler: Handler<
  CustomMessageAdminCreateUserTriggerEvent
> = async (event) => {
  if (event.triggerSource === 'CustomMessage_AdminCreateUser') {
    event.response = {
      smsMessage: `TNM Invite`,
      emailSubject: 'TNM Invite',
      emailMessage: makeEmail(
        event.request.userAttributes.given_name,
        event.request.usernameParameter,
        event.request.codeParameter
      ),
    };
  }

  console.log(event.response);

  return event;
};
