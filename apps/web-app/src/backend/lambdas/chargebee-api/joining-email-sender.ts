import { CustomMessageAdminCreateUserTriggerEvent, Handler } from 'aws-lambda';

const template = (username: string, name: string, password: string) =>
  `
<html>
  <body>
    <h1>Welcome ${name}</h1>
    <p>You have been invited to join The Nutritionist Manchester. Your temporary password is <span class='password'>${password}</span></p>
    <p style='display:none' class='username'>${username}</p>
    <p style='display:none' class='environment'>${process.env.ENVIRONMENT}</p>
  </body>
</html>`;

export const handler: Handler<
  CustomMessageAdminCreateUserTriggerEvent
> = async (event) => {
  if (event.triggerSource === 'CustomMessage_AdminCreateUser') {
    event.response = {
      smsMessage: `TNM Invite`,
      emailSubject: 'TNM Invite',
      emailMessage: template(
        event.request.usernameParameter,
        event.request.userAttributes.given_name,
        event.request.codeParameter
      ),
    };

    console.log(event);
  }

  console.log('finished');

  return event;
};
