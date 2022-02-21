import { AdminSetUserPasswordCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { CHARGEBEE, E2E, ENV, HTTP } from "@tnmw/constants";
import { ChargeBee, _event } from "chargebee-typescript"
import { createUser } from "../create-user";

export const handleCustomerCreatedEvent = async (client: ChargeBee, event: ReturnType<typeof client.event.deserialize>) => {

    const poolId = process.env[ENV.varNames.CognitoPoolId];
    const environment = process.env[ENV.varNames.EnvironmentName];

    const { id, email, first_name, last_name, billing_address, phone } =
      event.content.customer;

    const delivery1 = event.content.customer[CHARGEBEE.customFields.customer.deliveryDay1]
    const delivery2 = event.content.customer[CHARGEBEE.customFields.customer.deliveryDay2]
    const delivery3 = event.content.customer[CHARGEBEE.customFields.customer.deliveryDay3]
    const profileNotes = event.content.customer[CHARGEBEE.customFields.customer.customerProfileNotes]

    const {
      line1,
      line2,
      line3,
      city,
      country,
      zip: postcode,
    } = billing_address ?? {};

      await createUser({
        profileNotes,
        delivery1,
        delivery2,
        delivery3,
        address1: line1,
        address2: line2,
        address3: line3,
        phone,
        city,
        country,
        postcode,
        first_name,
        last_name,
        username: id,
        poolId,
        email,
      });

      if (
        environment !== 'prod' &&
        email.trim().toLowerCase() === E2E.testEmail
      ) {
        const client = new CognitoIdentityProviderClient({});

        const params = {
          Password: E2E.testPassword,
          Permanent: true,
          Username: id,
          UserPoolId: poolId,
        };
        const changeCommand = new AdminSetUserPasswordCommand(params);
        await client.send(changeCommand);
      }

      return {
        statusCode: HTTP.statusCodes.Ok,
      };
    }

