import { APIGatewayProxyEventV2 } from 'aws-lambda';

import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminCreateUserCommandInput,
  AdminUpdateUserAttributesCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';

import { mock } from 'jest-mock-extended';
import { handler } from './webhook';
import { mockClient } from 'aws-sdk-client-mock';
import { when } from 'jest-when';
import { ENV, HTTP, COGNITO, CHARGEBEE } from '@tnmw/constants';
import { getPlans } from './get-plans';
import { getSecrets } from '../get-secrets';
import { StandardPlan } from '@tnmw/types';
import { userExists } from './user-exists';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const cognitoMock = mockClient(CognitoIdentityProviderClient);

jest.mock('./get-plans');
jest.mock('./user-exists');
jest.mock('../get-secrets');

describe('the webhook handler', () => {
  beforeEach(() => {
    jest.mocked(userExists).mockResolvedValue(true);
    jest.mocked(getPlans).mockResolvedValue([]);
    jest
      .mocked(getSecrets)
      .mockReturnValue([
        Promise.resolve('my-token'),
        Promise.resolve('my-user'),
        Promise.resolve('my-password'),
      ]);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
    cognitoMock.reset();
    delete process.env[ENV.varNames.CognitoPoolId];
    delete process.env[ENV.varNames.ChargeBeeWebhookUsername];
    delete process.env[ENV.varNames.ChargeBeeWebhookPasssword];
    delete process.env[ENV.varNames.ChargeBeeToken];
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

    jest
      .mocked(getSecrets)
      .mockReturnValue([
        Promise.resolve('my-token'),
        Promise.resolve('something-else'),
        Promise.resolve('something-more-else'),
      ]);

    process.env[ENV.varNames.ChargeBeeWebhookUsername] = 'test-user';
    process.env[ENV.varNames.ChargeBeeWebhookPasssword] = 'test-password';
    process.env[ENV.varNames.EnvironmentName] = 'prod';
    process.env[ENV.varNames.ChargeBeeToken] = 'foo';

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

    expect(response).toStrictEqual(
      expect.objectContaining({
        statusCode: HTTP.statusCodes.Forbidden,
      })
    );
  });

  it('returns 200 but does nothing if non production and not @thenutritionistmcr.com', async () => {
    /* eslint-disable unicorn/numeric-separators-style */

    const testCustomerId = 'test-customer-id';
    const testEmail = 'hello@example.com';

    const basicAuthUser = 'test-user';
    const basicAuthPassword = 'test-password';

    jest
      .mocked(getSecrets)
      .mockReturnValue([
        Promise.resolve('my-token'),
        Promise.resolve(basicAuthUser),
        Promise.resolve(basicAuthPassword),
      ]);

    process.env[ENV.varNames.ChargeBeeWebhookUsername] = basicAuthUser;
    process.env[ENV.varNames.ChargeBeeWebhookPasssword] = basicAuthPassword;
    process.env[ENV.varNames.ChargeBeeToken] = 'foo';
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

  it.skip('updates the plan when a subscription is changed', async () => {
    const mockItemPriceId = 'mock-item-price-id';
    jest.resetAllMocks();
    process.env[ENV.varNames.CognitoPoolId] = 'test-pool-id';
    process.env[ENV.varNames.ChargeBeeToken] = 'foo';
    const mockPlans: StandardPlan[] = [
      {
        id: 'foo',
        subscriptionStatus: 'active',
        name: 'Foo',
        daysPerWeek: 4,
        itemsPerDay: 8,
        isExtra: true,
        totalMeals: 32,
      },
    ];
    const testCustomerId = 'test-customer-id';
    when(jest.mocked(getPlans))
      .calledWith(expect.anything(), testCustomerId)
      .mockResolvedValue(mockPlans);

    const webhookBody = {
      id: 'ev_19ACW8Srxbe2l3cp',
      occurred_at: 1639842412,
      source: 'admin_console',
      user: 'bwainwright28@gmail.com',
      object: 'event',
      api_version: 'v2',
      content: {
        subscription: {
          id: '19ACbkSyZTArB4Sj',
          billing_period: 1,
          billing_period_unit: 'month',
          customer_id: testCustomerId,
          status: 'active',
          current_term_start: 1645898691,
          current_term_end: 1648317891,
          next_billing_at: 1648317891,
          created_at: 1645898691,
          started_at: 1645898691,
          activated_at: 1645898691,
          updated_at: 1645901286,
          has_scheduled_changes: false,
          channel: 'web',
          resource_version: 1645901286898,
          deleted: false,
          object: 'subscription',
          currency_code: 'GBP',
          subscription_items: [
            {
              item_price_id: mockItemPriceId,
              item_type: 'plan',
              quantity: 1,
              unit_price: 7965,
              amount: 7965,
              free_quantity: 0,
              object: 'subscription_item',
            },
          ],
          due_invoices_count: 0,
          mrr: 3540,
          exchange_rate: 1,
          base_currency_code: 'GBP',
        },
        customer: {
          id: testCustomerId,
          first_name: 'Ben',
          last_name: 'Wainwright',
          email: 'bwainwright28@gmail.com',
          phone: '07872591841',
          company: 'Company',
          auto_collection: 'on',
          net_term_days: 0,
          allow_direct_debit: false,
          created_at: 1645895214,
          taxability: 'taxable',
          updated_at: 1645901286,
          pii_cleared: 'active',
          channel: 'web',
          resource_version: 1645901286731,
          deleted: false,
          object: 'customer',
          card_status: 'valid',
          promotional_credits: 0,
          refundable_credits: 0,
          excess_payments: 0,
          unbilled_charges: 0,
          preferred_currency_code: 'GBP',
          mrr: 0,
          primary_payment_source_id: 'pm_19ACbkSyZT5Lx4SY',
          payment_method: {
            object: 'payment_method',
            type: 'card',
            reference_id: 'tok_19ACbkSyZT5Ll4SX',
            gateway: 'chargebee',
            gateway_account_id: 'gw_199LVfSrH8SXXo',
            status: 'valid',
          },
          cf_customer_profile_notes: 'asd',
          cf_cook_1_delivery_day: 'Monday',
          cf_cook_2_delivery_day: 'Tuesday',
          cf_cook_3_delivery_day: 'Wednesday',
        },
        card: {
          status: 'valid',
          gateway: 'chargebee',
          gateway_account_id: 'gw_199LVfSrH8SXXo',
          first_name: 'Ben',
          last_name: 'Wainwright',
          iin: '411111',
          last4: '1111',
          card_type: 'visa',
          funding_type: 'credit',
          expiry_month: 12,
          expiry_year: 2023,
          created_at: 1645898670,
          updated_at: 1645898670,
          resource_version: 1645898670130,
          object: 'card',
          masked_number: '************1111',
          customer_id: testCustomerId,
          payment_source_id: 'pm_19ACbkSyZT5Lx4SY',
        },
        invoice: {
          id: '9',
          customer_id: testCustomerId,
          subscription_id: '19ACbkSyZTArB4Sj',
          recurring: true,
          status: 'paid',
          price_type: 'tax_exclusive',
          date: 1645901286,
          due_date: 1645901286,
          net_term_days: 0,
          exchange_rate: 1,
          total: 7956,
          amount_paid: 4420,
          amount_adjusted: 0,
          write_off_amount: 0,
          credits_applied: 3536,
          amount_due: 0,
          paid_at: 1645901286,
          updated_at: 1645901286,
          resource_version: 1645901286856,
          deleted: false,
          object: 'invoice',
          first_invoice: false,
          amount_to_collect: 0,
          round_off_amount: 0,
          has_advance_charges: false,
          currency_code: 'GBP',
          base_currency_code: 'GBP',
          generated_at: 1645901286,
          is_gifted: false,
          term_finalized: true,
          channel: 'web',
          tax: 0,
          line_items: [
            {
              id: 'li_19ACbkSyZe40G4ZG',
              date_from: 1645901286,
              date_to: 1648317891,
              unit_amount: 7956,
              quantity: 1,
              amount: 7956,
              pricing_model: 'flat_fee',
              is_taxed: false,
              tax_amount: 0,
              object: 'line_item',
              subscription_id: '19ACbkSyZTArB4Sj',
              customer_id: testCustomerId,
              description: 'Mass 3 / 3 day - Prorated Charges',
              entity_type: 'plan_item_price',
              entity_id: 'Mass-3-3-day-GBP-Monthly',
              tax_exempt_reason: 'tax_not_configured',
              discount_amount: 0,
              item_level_discount_amount: 0,
            },
          ],
          sub_total: 7956,
          linked_payments: [
            {
              txn_id: 'txn_19ACbkSyZe43c4ZK',
              applied_amount: 4420,
              applied_at: 1645901286,
              txn_status: 'success',
              txn_date: 1645901286,
              txn_amount: 4420,
            },
          ],
          applied_credits: [
            {
              applied_amount: 3536,
              applied_at: 1645901286,
              cn_id: 'TEST-CN-3',
              cn_reason_code: 'subscription_change',
              cn_create_reason_code: 'Subscription Change',
              cn_date: 1645901286,
              cn_status: 'refunded',
            },
          ],
          adjustment_credit_notes: [],
          issued_credit_notes: [],
          linked_orders: [],
          dunning_attempts: [],
          billing_address: {
            first_name: 'Ben',
            last_name: 'Wainwright',
            company: 'Company',
            validation_status: 'not_validated',
            object: 'billing_address',
          },
        },
        credit_notes: [
          {
            id: 'TEST-CN-3',
            customer_id: testCustomerId,
            subscription_id: '19ACbkSyZTArB4Sj',
            reference_invoice_id: '8',
            type: 'refundable',
            reason_code: 'subscription_change',
            status: 'refunded',
            date: 1645901286,
            price_type: 'tax_exclusive',
            exchange_rate: 1,
            total: 3536,
            amount_allocated: 3536,
            amount_refunded: 0,
            amount_available: 0,
            refunded_at: 1645901286,
            generated_at: 1645901286,
            updated_at: 1645901286,
            channel: 'web',
            resource_version: 1645901286891,
            deleted: false,
            object: 'credit_note',
            create_reason_code: 'Subscription Change',
            currency_code: 'GBP',
            round_off_amount: 0,
            fractional_correction: 0,
            base_currency_code: 'GBP',
            sub_total: 3536,
            line_items: [
              {
                id: 'li_19ACbkSyZe40X4ZI',
                date_from: 1645901286,
                date_to: 1648317891,
                unit_amount: 3536,
                quantity: 1,
                amount: 3536,
                pricing_model: 'flat_fee',
                is_taxed: false,
                tax_amount: 0,
                object: 'line_item',
                subscription_id: '19ACbkSyZTArB4Sj',
                customer_id: testCustomerId,
                description:
                  'Mass 2 / 2 day - Prorated Credits for 26-Feb-2022 - 26-Mar-2022',
                entity_type: 'plan_item_price',
                entity_id: 'Mass-2-2-day-GBP-Monthly',
                tax_exempt_reason: 'tax_not_configured',
                discount_amount: 0,
                item_level_discount_amount: 0,
              },
            ],
            taxes: [],
            line_item_taxes: [],
            line_item_discounts: [],
            linked_refunds: [],
            allocations: [
              {
                allocated_amount: 3536,
                allocated_at: 1645901286,
                invoice_id: '9',
                invoice_date: 1645901286,
                invoice_status: 'paid',
              },
            ],
          },
        ],
      },
      event_type: 'subscription_changed',
      webhook_status: 'not_configured',
    };

    const now = new Date('2020-01-01').getTime();

    jest.useFakeTimers();

    const input: AdminUpdateUserAttributesCommandInput = {
      UserPoolId: 'test-pool-id',
      Username: testCustomerId,
      UserAttributes: [
        {
          Name: `custom:${COGNITO.customAttributes.Plans}`,
          Value: JSON.stringify(mockPlans),
        },
        {
          Name: `custom:${COGNITO.customAttributes.SubscriptionUpdateTimestamp}`,
          Value: String(now / 1000),
        },
      ],
    };

    const basicAuthUser = 'test-user';
    const basicAuthPassword = 'test-password';

    process.env[ENV.varNames.ChargeBeeWebhookUsername] = basicAuthUser;
    process.env[ENV.varNames.ChargeBeeWebhookPasssword] = basicAuthPassword;
    process.env[ENV.varNames.EnvironmentName] = 'prod';
    process.env[ENV.varNames.ChargeBeeToken] = 'foo';

    jest
      .mocked(getSecrets)
      .mockReturnValue([
        Promise.resolve('my-token'),
        Promise.resolve(basicAuthUser),
        Promise.resolve(basicAuthPassword),
      ]);

    const encodedBasicAuth = Buffer.from(
      `${basicAuthUser}:${basicAuthPassword}`
    ).toString('base64');

    const mockEvent = mock<APIGatewayProxyEventV2>();

    mockEvent.body = JSON.stringify(webhookBody);
    mockEvent.headers = {
      [HTTP.headerNames.Authorization]: `Basic ${encodedBasicAuth}`,
    };

    const response = await handler(mockEvent, mock(), mock());

    const calls = cognitoMock.commandCalls(
      // TODO raise bug report on aws-sdk-client-mock repo for this type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AdminUpdateUserAttributesCommand as any,
      input
    );

    expect(calls).toHaveLength(1);

    expect(response).toStrictEqual({
      statusCode: 200,
    });
  });

  it.skip('updates the plan when a subscription is created', async () => {
    const mockItemPriceId = 'mock-item-price-id';
    jest.resetAllMocks();
    process.env[ENV.varNames.CognitoPoolId] = 'test-pool-id';
    process.env[ENV.varNames.ChargeBeeToken] = 'foo';
    const mockPlans: StandardPlan[] = [
      {
        id: 'foo',
        subscriptionStatus: 'active',
        name: 'Foo',
        daysPerWeek: 2,
        itemsPerDay: 4,
        isExtra: true,
        totalMeals: 8,
      },
    ];
    const testCustomerId = 'test-customer-id';
    when(jest.mocked(getPlans))
      .calledWith(expect.anything(), testCustomerId)
      .mockResolvedValue(mockPlans);

    const webhookBody = {
      id: 'ev_19ACW8Srxbe2l3cp',
      occurred_at: 1639842412,
      source: 'admin_console',
      user: 'bwainwright28@gmail.com',
      object: 'event',
      api_version: 'v2',
      content: {
        subscription: {
          id: '199YdgSxWryj93Q1',
          billing_period: 1,
          billing_period_unit: 'month',
          customer_id: testCustomerId,
          status: 'active',
          current_term_start: 1644944141,
          current_term_end: 1647363341,
          next_billing_at: 1647363341,
          created_at: 1644944141,
          started_at: 1644944141,
          activated_at: 1644944141,
          updated_at: 1644944141,
          has_scheduled_changes: false,
          channel: 'web',
          resource_version: 1644944141213,
          deleted: false,
          object: 'subscription',
          currency_code: 'GBP',
          subscription_items: [
            {
              item_price_id: mockItemPriceId,
              item_type: 'plan',
              quantity: 1,
              unit_price: 9120,
              amount: 9120,
              free_quantity: 0,
              object: 'subscription_item',
            },
          ],
          due_invoices_count: 0,
          mrr: 0,
        },
        customer: {
          id: testCustomerId,
          first_name: 'Ben',
          last_name: 'Wainwright',
          email: 'bwainwright28@gmail.com',
          auto_collection: 'on',
          net_term_days: 0,
          allow_direct_debit: false,
          created_at: 1643895044,
          taxability: 'taxable',
          updated_at: 1644942037,
          pii_cleared: 'active',
          channel: 'web',
          resource_version: 1644942037485,
          deleted: false,
          object: 'customer',
          billing_address: {
            first_name: 'Ben',
            last_name: 'Wainwright',
            phone: '+4407872591841',
            line1: 'Flat 5',
            line2: 'Block C',
            line3: '12 Pollard Street',
            city: 'Manchester',
            country: 'GB',
            zip: 'M4 7AL',
            validation_status: 'not_validated',
            object: 'billing_address',
          },
          card_status: 'valid',
          promotional_credits: 0,
          refundable_credits: 0,
          excess_payments: 0,
          unbilled_charges: 0,
          preferred_currency_code: 'GBP',
          mrr: 0,
          primary_payment_source_id: 'pm_19ACc5SxWj9V836b',
          payment_method: {
            object: 'payment_method',
            type: 'card',
            reference_id: 'tok_19ACc5SxWj9Uv36a',
            gateway: 'chargebee',
            gateway_account_id: 'gw_199LVfSrH8SXXo',
            status: 'valid',
          },
        },
        card: {
          status: 'valid',
          gateway: 'chargebee',
          gateway_account_id: 'gw_199LVfSrH8SXXo',
          first_name: 'Ben',
          last_name: 'Wainwright',
          iin: '411111',
          last4: '1111',
          card_type: 'visa',
          funding_type: 'credit',
          expiry_month: 12,
          expiry_year: 2023,
          billing_addr1: 'Flat 5, Block C',
          billing_addr2: 'Card Billing Info',
          billing_zip: 'M4 7AL',
          created_at: 1644942037,
          updated_at: 1644942037,
          resource_version: 1644942037482,
          object: 'card',
          masked_number: '************1111',
          customer_id: 'test-four-cb',
          payment_source_id: 'pm_19ACc5SxWj9V836b',
        },
        invoice: {
          id: '6',
          customer_id: testCustomerId,
          subscription_id: '199YdgSxWryj93Q1',
          recurring: true,
          status: 'paid',
          price_type: 'tax_exclusive',
          date: 1644944141,
          due_date: 1644944141,
          net_term_days: 0,
          exchange_rate: 1,
          total: 9120,
          amount_paid: 9120,
          amount_adjusted: 0,
          write_off_amount: 0,
          credits_applied: 0,
          amount_due: 0,
          paid_at: 1644944141,
          updated_at: 1644944141,
          resource_version: 1644944141204,
          deleted: false,
          object: 'invoice',
          first_invoice: true,
          amount_to_collect: 0,
          round_off_amount: 0,
          new_sales_amount: 9120,
          has_advance_charges: false,
          currency_code: 'GBP',
          base_currency_code: 'GBP',
          generated_at: 1644944141,
          is_gifted: false,
          term_finalized: true,
          channel: 'web',
          tax: 0,
          line_items: [
            {
              id: 'li_199YdgSxWryjj3Q3',
              date_from: 1644944141,
              date_to: 1647363341,
              unit_amount: 9120,
              quantity: 1,
              amount: 9120,
              pricing_model: 'flat_fee',
              is_taxed: false,
              tax_amount: 0,
              object: 'line_item',
              subscription_id: '199YdgSxWryj93Q1',
              customer_id: 'test-four-cb',
              description: 'EQ 2 / 6 day',
              entity_type: 'plan_item_price',
              entity_id: 'EQ-2-6-day-GBP-Monthly',
              tax_exempt_reason: 'tax_not_configured',
              discount_amount: 0,
              item_level_discount_amount: 0,
            },
          ],
          sub_total: 9120,
          linked_payments: [
            {
              txn_id: 'txn_199YdgSxWryki3Q4',
              applied_amount: 9120,
              applied_at: 1644944141,
              txn_status: 'success',
              txn_date: 1644944141,
              txn_amount: 9120,
            },
          ],
          applied_credits: [],
          adjustment_credit_notes: [],
          issued_credit_notes: [],
          linked_orders: [],
          dunning_attempts: [],
          billing_address: {
            first_name: 'Ben',
            last_name: 'Wainwright',
            phone: '+4407872591841',
            line1: 'Flat 5',
            line2: 'Block C',
            line3: '12 Pollard Street',
            city: 'Manchester',
            country: 'GB',
            zip: 'M4 7AL',
            validation_status: 'not_validated',
            object: 'billing_address',
          },
        },
      },
      event_type: 'subscription_created',
      webhook_status: 'not_configured',
    };

    const now = new Date('2020-01-01').getTime();

    jest.useFakeTimers();

    const input: AdminUpdateUserAttributesCommandInput = {
      UserPoolId: 'test-pool-id',
      Username: testCustomerId,
      UserAttributes: [
        {
          Name: `custom:${COGNITO.customAttributes.Plans}`,
          Value: JSON.stringify(mockPlans),
        },
        {
          Name: `custom:${COGNITO.customAttributes.SubscriptionUpdateTimestamp}`,
          Value: String(now / 1000),
        },
      ],
    };

    const basicAuthUser = 'test-user';
    const basicAuthPassword = 'test-password';

    jest
      .mocked(getSecrets)
      .mockReturnValue([
        Promise.resolve('my-token'),
        Promise.resolve(basicAuthUser),
        Promise.resolve(basicAuthPassword),
      ]);

    process.env[ENV.varNames.ChargeBeeWebhookUsername] = basicAuthUser;
    process.env[ENV.varNames.ChargeBeeWebhookPasssword] = basicAuthPassword;
    process.env[ENV.varNames.ChargeBeeToken] = 'foo';
    process.env[ENV.varNames.EnvironmentName] = 'prod';

    const encodedBasicAuth = Buffer.from(
      `${basicAuthUser}:${basicAuthPassword}`
    ).toString('base64');

    const mockEvent = mock<APIGatewayProxyEventV2>();

    mockEvent.body = JSON.stringify(webhookBody);
    mockEvent.headers = {
      [HTTP.headerNames.Authorization]: `Basic ${encodedBasicAuth}`,
    };

    const response = await handler(mockEvent, mock(), mock());

    const calls = cognitoMock.commandCalls(
      // TODO raise bug report on aws-sdk-client-mock repo for this type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AdminUpdateUserAttributesCommand as any,
      input
    );

    expect(calls).toHaveLength(1);

    expect(response).toStrictEqual({
      statusCode: 200,
    });
  });

  it('updates the customer when customer is changed', async () => {
    /* eslint-disable unicorn/numeric-separators-style */

    const testCustomerId = 'test-customer-id';
    const testEmail = 'bwainwright28@gmail.com';

    const basicAuthUser = 'test-user';
    const basicAuthPassword = 'test-password';

    process.env[ENV.varNames.ChargeBeeWebhookUsername] = basicAuthUser;
    process.env[ENV.varNames.ChargeBeeWebhookPasssword] = basicAuthPassword;
    process.env[ENV.varNames.EnvironmentName] = 'prod';
    process.env[ENV.varNames.ChargeBeeToken] = 'foo';

    jest
      .mocked(getSecrets)
      .mockReturnValue([
        Promise.resolve('my-token'),
        Promise.resolve(basicAuthUser),
        Promise.resolve(basicAuthPassword),
      ]);

    const encodedBasicAuth = Buffer.from(
      `${basicAuthUser}:${basicAuthPassword}`
    ).toString('base64');

    // Webhook sample comes from pressing the 'test webhook' button in the console
    const webhookBody = {
      id: 'ev_19ACW8Srxbe2l3cp',
      occurred_at: 1639842412,
      source: 'admin_console',
      user: 'bwainwright28@gmail.com',
      object: 'event',
      api_version: 'v2',
      content: {
        customer: {
          id: testCustomerId,
          first_name: 'Ben',
          last_name: 'Wainwright',
          email: testEmail,
          phone: '07462699468',
          company: 'Company',
          auto_collection: 'on',
          net_term_days: 0,
          allow_direct_debit: false,
          created_at: 1645895214,
          taxability: 'taxable',
          updated_at: 1645957670,
          pii_cleared: 'active',
          channel: 'web',
          resource_version: 1645957670144,
          deleted: false,
          object: 'customer',
          billing_address: {
            first_name: 'Ben',
            last_name: 'Wainwright',
            email: testEmail,
            company: 'The Nutritionist Manchester',
            phone: '+4407462699468',
            line1: '14 Wadlow Close',
            line2: 'another line',
            line3: 'final line',
            city: 'Salford',
            country: 'GB',
            zip: 'M3 6WD',
            validation_status: 'not_validated',
            object: 'billing_address',
          },
          card_status: 'valid',
          promotional_credits: 0,
          refundable_credits: 0,
          excess_payments: 0,
          unbilled_charges: 0,
          preferred_currency_code: 'GBP',
          mrr: 0,
          primary_payment_source_id: 'pm_19ACbkSyZT5Lx4SY',
          payment_method: {
            object: 'payment_method',
            type: 'card',
            reference_id: 'tok_19ACbkSyZT5Ll4SX',
            gateway: 'chargebee',
            gateway_account_id: 'gw_199LVfSrH8SXXo',
            status: 'valid',
          },
          cf_customer_profile_notes: 'some notes',
          cf_cook_1_delivery_day: 'Thursday',
          cf_cook_2_delivery_day: 'Tuesday',
          cf_cook_3_delivery_day: 'Wednesday',
        },
        card: {
          status: 'valid',
          gateway: 'chargebee',
          gateway_account_id: 'gw_199LVfSrH8SXXo',
          first_name: 'Ben',
          last_name: 'Wainwright',
          iin: '411111',
          last4: '1111',
          card_type: 'visa',
          funding_type: 'credit',
          expiry_month: 12,
          expiry_year: 2023,
          created_at: 1645898670,
          updated_at: 1645898670,
          resource_version: 1645898670130,
          object: 'card',
          masked_number: '************1111',
          customer_id: 'test',
          payment_source_id: 'pm_19ACbkSyZT5Lx4SY',
        },
      },
      event_type: 'customer_changed',
      webhook_status: 'not_configured',
    };
    /* eslint-enable/numeric-separators-style */

    jest.useFakeTimers();

    const mockEvent = mock<APIGatewayProxyEventV2>();

    mockEvent.body = JSON.stringify(webhookBody);
    mockEvent.headers = {
      [HTTP.headerNames.Authorization]: `Basic ${encodedBasicAuth}`,
    };

    process.env[ENV.varNames.CognitoPoolId] = 'test-pool-id';

    const response = await handler(mockEvent, mock(), mock());

    const calls = cognitoMock.commandCalls(
      // TODO raise bug report on aws-sdk-client-mock repo for this type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AdminUpdateUserAttributesCommand as any
      // input
    );

    expect(calls).toHaveLength(1);

    expect(response).toStrictEqual({
      statusCode: 200,
    });
  });

  it.skip('creates a new customer in cognito when called with a customer created event on production with anyone', async () => {
    /* eslint-disable unicorn/numeric-separators-style */

    const testCustomerId = 'test-customer-id';
    const testEmail = 'bwainwright28@gmail.com';

    const basicAuthUser = 'test-user';
    const basicAuthPassword = 'test-password';

    jest
      .mocked(getSecrets)
      .mockReturnValue([
        Promise.resolve('my-token'),
        Promise.resolve(basicAuthUser),
        Promise.resolve(basicAuthPassword),
      ]);

    process.env[ENV.varNames.ChargeBeeWebhookUsername] = basicAuthUser;
    process.env[ENV.varNames.ChargeBeeToken] = 'foo';
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
      user: 'bwainwright28@gmail.com',
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
            email: 'bwainwright28@gmail.com',
            phone: '+447462699468',
            line1: '14 Wadlow Close',
            line2: 'another line',
            line3: 'final line',
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
          [CHARGEBEE.customFields.customer.customerProfileNotes]: 'some notes',
          [CHARGEBEE.customFields.customer.deliveryDay1]: 'Monday',
          [CHARGEBEE.customFields.customer.deliveryDay2]: 'Tuesday',
          [CHARGEBEE.customFields.customer.deliveryDay3]: 'Thursday',
        },
      },
      event_type: 'customer_created',
      webhook_status: 'not_configured',
    };
    /* eslint-enable/numeric-separators-style */

    const now = new Date('2020-01-01').getTime();

    jest.useFakeTimers();

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
          Name: `custom:${COGNITO.customAttributes.City}`,
          Value: `Salford`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.Country}`,
          Value: `GB`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.Postcode}`,
          Value: `M3 6WD`,
        },
        {
          Name: COGNITO.standardAttributes.phone,
          Value: `+447462699468`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.AddressLine1}`,
          Value: `14 Wadlow Close`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.AddressLine2}`,
          Value: `another line`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.AddressLine3}`,
          Value: `final line`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.ProfileNotes}`,
          Value: `some notes`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.DeliveryDay1}`,
          Value: `Monday`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.DeliveryDay2}`,
          Value: `Tuesday`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.DeliveryDay3}`,
          Value: `Thursday`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.CustomerUpdateTimestamp}`,
          Value: String(now / 1000),
        },
        {
          Name: `custom:${COGNITO.customAttributes.ChargebeeId}`,
          Value: testCustomerId,
        },
        {
          Name: COGNITO.standardAttributes.email,
          Value: testEmail,
        },
        {
          Name: COGNITO.standardAttributes.emailVerified,
          Value: `true`,
        },
        {
          Name: COGNITO.standardAttributes.firstName,
          Value: `Scott`,
        },
        {
          Name: COGNITO.standardAttributes.surname,
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

  it.skip('creates a new customer in cognito when called with a customer created event on non production with @thenutritionistmcr.com address', async () => {
    /* eslint-disable unicorn/numeric-separators-style */

    const testCustomerId = 'test-customer-id';
    const testEmail = 'foo@thenutritionistmcr.com';

    const basicAuthUser = 'test-user';
    const basicAuthPassword = 'test-password';

    jest
      .mocked(getSecrets)
      .mockReturnValue([
        Promise.resolve('my-token'),
        Promise.resolve(basicAuthUser),
        Promise.resolve(basicAuthPassword),
      ]);

    process.env[ENV.varNames.ChargeBeeToken] = 'foo';
    process.env[ENV.varNames.ChargeBeeWebhookUsername] = basicAuthUser;
    process.env[ENV.varNames.ChargeBeeWebhookPasssword] = basicAuthPassword;
    process.env[ENV.varNames.EnvironmentName] = 'non-production';

    jest
      .mocked(getSecrets)
      .mockReturnValue([
        Promise.resolve('my-token'),
        Promise.resolve(basicAuthUser),
        Promise.resolve(basicAuthPassword),
      ]);

    const encodedBasicAuth = Buffer.from(
      `${basicAuthUser}:${basicAuthPassword}`
    ).toString('base64');

    // Webhook sample comes from pressing the 'test webhook' button in the console
    const webhookBody = {
      id: 'ev_19ACW8Srxbe2l3cp',
      occurred_at: 1639842412,
      source: 'admin_console',
      user: 'foo@thenutritionistmcr.com',
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
            email: 'foo@thenutritionistmcr.com',
            phone: '+447462699468',
            line1: '14 Wadlow Close',
            line2: 'another line',
            line3: 'final line',
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
          [CHARGEBEE.customFields.customer.customerProfileNotes]: 'some notes',
          [CHARGEBEE.customFields.customer.deliveryDay1]: 'Monday',
          [CHARGEBEE.customFields.customer.deliveryDay2]: 'Tuesday',
          [CHARGEBEE.customFields.customer.deliveryDay3]: 'Thursday',
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

    const now = new Date('2020-01-01').getTime();

    jest.useFakeTimers();

    const response = await handler(mockEvent, mock(), mock());

    const input: AdminCreateUserCommandInput = {
      UserPoolId: 'test-pool-id',
      Username: testCustomerId,

      UserAttributes: [
        {
          Name: `custom:${COGNITO.customAttributes.City}`,
          Value: `Salford`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.Country}`,
          Value: `GB`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.Postcode}`,
          Value: `M3 6WD`,
        },
        {
          Name: COGNITO.standardAttributes.phone,
          Value: `+447462699468`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.AddressLine1}`,
          Value: `14 Wadlow Close`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.AddressLine2}`,
          Value: `another line`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.AddressLine3}`,
          Value: `final line`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.ProfileNotes}`,
          Value: `some notes`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.DeliveryDay1}`,
          Value: `Monday`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.DeliveryDay2}`,
          Value: `Tuesday`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.DeliveryDay3}`,
          Value: `Thursday`,
        },
        {
          Name: `custom:${COGNITO.customAttributes.CustomerUpdateTimestamp}`,
          Value: String(now / 1000),
        },
        {
          Name: `custom:${COGNITO.customAttributes.ChargebeeId}`,
          Value: testCustomerId,
        },
        {
          Name: COGNITO.standardAttributes.email,
          Value: 'foo@thenutritionistmcr.com',
        },
        {
          Name: COGNITO.standardAttributes.emailVerified,
          Value: `true`,
        },
        {
          Name: COGNITO.standardAttributes.firstName,
          Value: `Scott`,
        },
        {
          Name: COGNITO.standardAttributes.surname,
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
