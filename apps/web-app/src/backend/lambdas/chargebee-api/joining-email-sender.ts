import { CustomMessageAdminCreateUserTriggerEvent, Handler } from "aws-lambda";

  const template = (name: string, password: string) => 
  `
<html>
  <body>
    <h1>Welcome</h1>
    <p>${name}! you have been invited to join The Nutritionist Manchester. Your temporary password is ${password}</p>
  </body>
</html>

  `

export const handler: Handler<CustomMessageAdminCreateUserTriggerEvent> = async event => {

  if(event.triggerSource === 'CustomMessage_AdminCreateUser') {
    event.response = {
      smsMessage: `TNM Invite`,
      emailSubject: "TNM Invite",
      emailMessage: template(event.request.userAttributes.name, event.request.codeParameter)
    }
  }

  return  event
}
