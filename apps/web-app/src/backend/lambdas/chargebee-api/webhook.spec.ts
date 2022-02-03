import { APIGatewayProxyEventV2 } from 'aws-lambda';

import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';

import { mock } from 'jest-mock-extended';
import { handler } from './webhook';
import { mockClient } from 'aws-sdk-client-mock';
import { ENV, HTTP, USER_ATTRIBUTES } from '../../../infrastructure/constants';

const cognitoMock = mockClient(CognitoIdentityProviderClient);

describe('the webhook handler', () => {
  afterEach(() => {
    cognitoMock.reset();
    delete process.env[ENV.varNames.CognitoPoolId];
    delete process.env[ENV.varNames.ChargeBeeWebhookUsername];
    delete process.env[ENV.varNames.ChargeBeeWebhookPasssword];
    delete process.env[ENV.varNames.EnvironmentName];
  });

  it('rejects the webhook if basic auth fails', async () => {
    /* eslint-disable unicorn/numeric-separators-style */

    const testCustomerId = 'test-customer-id';
    const testEmail = 'hello@example.com';

    const basicAuthUser = 'a-different-user';
    const basicAuthPassword = 'a-different-password';

    const encodedBasicAuth = Buffer.from(
      `${basicAuthUser}:${basicAuthPassword}`
    ).toString('base64');

    process.env[ENV.varNames.ChargeBeeWebhookUsername] = 'test-user';
    process.env[ENV.varNames.ChargeBeeWebhookPasssword] = 'test-password';
    process.env[ENV.varNames.EnvironmentName] = 'prod';

    // Webhook sample comes from pressing the 'test webhook' button in the console
    const webhookBody = {
      id: 'ev_19ACW8Srxbe2l3cp',
      occurred_at: 1639842412,
      source: 'admin_console',
      user: 'lawrence@thenutritionistmcr.com',
      object: 'event',
      api_version: 'v2',
      content: {
        customer: {
          id: testCustomerId,
          first_name: 'Scott',
          last_name: 'Dylan',
          email: testEmail,
          phone: '07462699468',
          auto_collection: 'on',
          net_term_days: 0,
          allow_direct_debit: false,
          created_at: 1639842412,
          taxability: 'taxable',
          updated_at: 1639842412,
          locale: 'en-GB',
          pii_cleared: 'active',
          channel: 'web',
          resource_version: 1639842412247,
          deleted: false,
          object: 'customer',
          billing_address: {
            first_name: 'Scott',
            last_name: 'Dylan',
            email: 'someone@thenutritionistmcr.com',
            phone: '+447462699468',
            line1: '14 Wadlow Close',
            city: 'Salford',
            country: 'GB',
            zip: 'M3 6WD',
            validation_status: 'not_validated',
            object: 'billing_address',
          },
          card_status: 'no_card',
          promotional_credits: 0,
          refundable_credits: 0,
          excess_payments: 0,
          unbilled_charges: 0,
          preferred_currency_code: 'GBP',
          mrr: 0,
        },
      },
      event_type: 'customer_created',
      webhook_status: 'not_configured',
    };
    /* eslint-enable/numeric-separators-style */

    const mockEvent = mock<APIGatewayProxyEventV2>();

    mockEvent.body = JSON.stringify(webhookBody);
    mockEvent.headers = {
      [HTTP.headerNames.Authorization]: `Basic ${encodedBasicAuth}`,
    };

    process.env[ENV.varNames.CognitoPoolId] = 'test-pool-id';

    const response = await handler(mockEvent, mock(), mock());

    const calls = cognitoMock.calls();

    expect(calls).toHaveLength(0);

    expect(response).toStrictEqual({
      statusCode: HTTP.statusCodes.Forbidden,
    });
  });

  it('returns 200 but does nothing if non production and not @thenutritionistmcr.com', async () => {
    /* eslint-disable unicorn/numeric-separators-style */

    const testCustomerId = 'test-customer-id';
    const testEmail = 'hello@example.com';

    const basicAuthUser = 'test-user';
    const basicAuthPassword = 'test-password';

    process.env[ENV.varNames.ChargeBeeWebhookUsername] = basicAuthUser;
    process.env[ENV.varNames.ChargeBeeWebhookPasssword] = basicAuthPassword;
    process.env[ENV.varNames.EnvironmentName] = 'non-production';

    const encodedBasicAuth = Buffer.from(
      `${basicAuthUser}:${basicAuthPassword}`
    ).toString('base64');

    // Webhook sample comes from pressing the 'test webhook' button in the console
    const webhookBody = {
      id: 'ev_19ACW8Srxbe2l3cp',
      occurred_at: 1639842412,
      source: 'admin_console',
      user: 'lawrence@thenutritionistmcr.com',
      object: 'event',
      api_version: 'v2',
      content: {
        customer: {
          id: testCustomerId,
          first_name: 'Scott',
          last_name: 'Dylan',
          email: testEmail,
          phone: '07462699468',
          auto_collection: 'on',
          net_term_days: 0,
          allow_direct_debit: false,
          created_at: 1639842412,
          taxability: 'taxable',
          updated_at: 1639842412,
          locale: 'en-GB',
          pii_cleared: 'active',
          channel: 'web',
          resource_version: 1639842412247,
          deleted: false,
          object: 'customer',
          billing_address: {
            first_name: 'Scott',
            last_name: 'Dylan',
            email: 'foo@bar.com',
            phone: '+447462699468',
            line1: '14 Wadlow Close',
            city: 'Salford',
            country: 'GB',
            zip: 'M3 6WD',
            validation_status: 'not_validated',
            object: 'billing_address',
          },
          card_status: 'no_card',
          promotional_credits: 0,
          refundable_credits: 0,
          excess_payments: 0,
          unbilled_charges: 0,
          preferred_currency_code: 'GBP',
          mrr: 0,
        },
      },
      event_type: 'customer_created',
      webhook_status: 'not_configured',
    };
    /* eslint-enable/numeric-separators-style */

    const mockEvent = mock<APIGatewayProxyEventV2>();

    mockEvent.body = JSON.stringify(webhookBody);
    mockEvent.headers = {
      [HTTP.headerNames.Authorization]: `Basic ${encodedBasicAuth}`,
    };

    process.env[ENV.varNames.CognitoPoolId] = 'test-pool-id';

    const response = await handler(mockEvent, mock(), mock());

    const calls = cognitoMock.calls();

    expect(calls).toHaveLength(0);

    expect(response).toStrictEqual({
      statusCode: 200,
    });
  });

  it('creates a new customer in cognito when called with a customer created event on production with anyone', async () => {
    /* eslint-disable unicorn/numeric-separators-style */

    const testCustomerId = 'test-customer-id';
    const testEmail = 'hello@example.com';

    const basicAuthUser = 'test-user';
    const basicAuthPassword = 'test-password';

    process.env[ENV.varNames.ChargeBeeWebhookUsername] = basicAuthUser;
    process.env[ENV.varNames.ChargeBeeWebhookPasssword] = basicAuthPassword;
    process.env[ENV.varNames.EnvironmentName] = 'prod';

    const encodedBasicAuth = Buffer.from(
      `${basicAuthUser}:${basicAuthPassword}`
    ).toString('base64');

    // Webhook sample comes from pressing the 'test webhook' button in the console
    const webhookBody = {
      id: 'ev_19ACW8Srxbe2l3cp',
      occurred_at: 1639842412,
      source: 'admin_console',
      user: 'lawrence@thenutritionistmcr.com',
      object: 'event',
      api_version: 'v2',
      content: {
        customer: {
          id: testCustomerId,
          first_name: 'Scott',
          last_name: 'Dylan',
          email: testEmail,
          phone: '07462699468',
          auto_collection: 'on',
          net_term_days: 0,
          allow_direct_debit: false,
          created_at: 1639842412,
          taxability: 'taxable',
          updated_at: 1639842412,
          locale: 'en-GB',
          pii_cleared: 'active',
          channel: 'web',
          resource_version: 1639842412247,
          deleted: false,
          object: 'customer',
          billing_address: {
            first_name: 'Scott',
            last_name: 'Dylan',
            email: 'foo@bar.com',
            phone: '+447462699468',
            line1: '14 Wadlow Close',
            city: 'Salford',
            country: 'GB',
            zip: 'M3 6WD',
            validation_status: 'not_validated',
            object: 'billing_address',
          },
          card_status: 'no_card',
          promotional_credits: 0,
          refundable_credits: 0,
          excess_payments: 0,
          unbilled_charges: 0,
          preferred_currency_code: 'GBP',
          mrr: 0,
        },
      },
      event_type: 'customer_created',
      webhook_status: 'not_configured',
    };
    /* eslint-enable/numeric-separators-style */

    const mockEvent = mock<APIGatewayProxyEventV2>();

    mockEvent.body = JSON.stringify(webhookBody);
    mockEvent.headers = {
      [HTTP.headerNames.Authorization]: `Basic ${encodedBasicAuth}`,
    };

    process.env[ENV.varNames.CognitoPoolId] = 'test-pool-id';

    const response = await handler(mockEvent, mock(), mock());

    const input: AdminCreateUserCommandInput = {
      UserPoolId: 'test-pool-id',
      Username: testCustomerId,

      UserAttributes: [
        {
          Name: `custom:${USER_ATTRIBUTES.ChargebeeId}`,
          Value: testCustomerId,
        },
        {
          Name: `email`,
          Value: testEmail,
        },
        {
          Name: `email_verified`,
          Value: `true`,
        },
        {
          Name: `given_name`,
          Value: `Scott`,
        },
        {
          Name: `family_name`,
          Value: `Dylan`,
        },
      ],
    };

    const calls = cognitoMock.commandCalls(
      // TODO raise bug report on aws-sdk-client-mock repo for this type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AdminCreateUserCommand as any,
      input
    );

    expect(calls).toHaveLength(1);

    expect(response).toStrictEqual({
      statusCode: 200,
    });
  });

  it('creates a new customer in cognito when called with a customer created event on non production with @thenutritionistmcr.com address', async () => {
    /* eslint-disable unicorn/numeric-separators-style */

    const testCustomerId = 'test-customer-id';
    const testEmail = 'test@thenutritionistmcr.com';

    const basicAuthUser = 'test-user';
    const basicAuthPassword = 'test-password';

    process.env[ENV.varNames.ChargeBeeWebhookUsername] = basicAuthUser;
    process.env[ENV.varNames.ChargeBeeWebhookPasssword] = basicAuthPassword;
    process.env[ENV.varNames.EnvironmentName] = 'non-production';

    const encodedBasicAuth = Buffer.from(
      `${basicAuthUser}:${basicAuthPassword}`
    ).toString('base64');

    // Webhook sample comes from pressing the 'test webhook' button in the console
    const webhookBody = {
      id: 'ev_19ACW8Srxbe2l3cp',
      occurred_at: 1639842412,
      source: 'admin_console',
      user: 'lawrence@thenutritionistmcr.com',
      object: 'event',
      api_version: 'v2',
      content: {
        customer: {
          id: testCustomerId,
          first_name: 'Scott',
          last_name: 'Dylan',
          email: testEmail,
          phone: '07462699468',
          auto_collection: 'on',
          net_term_days: 0,
          allow_direct_debit: false,
          created_at: 1639842412,
          taxability: 'taxable',
          updated_at: 1639842412,
          locale: 'en-GB',
          pii_cleared: 'active',
          channel: 'web',
          resource_version: 1639842412247,
          deleted: false,
          object: 'customer',
          billing_address: {
            first_name: 'Scott',
            last_name: 'Dylan',
            email: 'someone@thenutritionistmcr.com',
            phone: '+447462699468',
            line1: '14 Wadlow Close',
            city: 'Salford',
            country: 'GB',
            zip: 'M3 6WD',
            validation_status: 'not_validated',
            object: 'billing_address',
          },
          card_status: 'no_card',
          promotional_credits: 0,
          refundable_credits: 0,
          excess_payments: 0,
          unbilled_charges: 0,
          preferred_currency_code: 'GBP',
          mrr: 0,
        },
      },
      event_type: 'customer_created',
      webhook_status: 'not_configured',
    };
    /* eslint-enable/numeric-separators-style */

    const mockEvent = mock<APIGatewayProxyEventV2>();

    mockEvent.body = JSON.stringify(webhookBody);
    mockEvent.headers = {
      [HTTP.headerNames.Authorization]: `Basic ${encodedBasicAuth}`,
    };

    process.env[ENV.varNames.CognitoPoolId] = 'test-pool-id';

    const response = await handler(mockEvent, mock(), mock());

    const input: AdminCreateUserCommandInput = {
      UserPoolId: 'test-pool-id',
      Username: testCustomerId,

      UserAttributes: [
        {
          Name: `custom:${USER_ATTRIBUTES.ChargebeeId}`,
          Value: testCustomerId,
        },
        {
          Name: `email`,
          Value: testEmail,
        },
        {
          Name: `email_verified`,
          Value: `true`,
        },
        {
          Name: `given_name`,
          Value: `Scott`,
        },
        {
          Name: `family_name`,
          Value: `Dylan`,
        },
      ],
    };

    const calls = cognitoMock.commandCalls(
      // TODO raise bug report on aws-sdk-client-mock repo for this type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AdminCreateUserCommand as any,
      input
    );

    expect(calls).toHaveLength(1);

    expect(response).toStrictEqual({
      statusCode: 200,
    });
  });
});
