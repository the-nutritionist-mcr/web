import { Customer } from '@tnmw/types';
import { mock } from 'jest-mock-extended';
import { Content, ContentTable } from 'pdfmake/interfaces';
import generateDeliveryPlanDocumentDefinition from './generateDeliveryPlanDocumentDefinition';

const isTable = (thing: Content): thing is ContentTable =>
  Boolean((thing as ContentTable).table);

describe('generate delivery plan document definition', () => {
  it('is sorted in alphabetical order', () => {
    const mockCustomer2 = mock<Customer>();
    mockCustomer2.firstName = 'joe';
    mockCustomer2.surname = 'gef';

    const mockCustomer1 = mock<Customer>();
    mockCustomer1.firstName = 'joe';
    mockCustomer1.surname = 'abc';

    const mockCustomer3 = mock<Customer>();
    mockCustomer3.firstName = 'joe';
    mockCustomer3.surname = 'def';

    const mockCustomer4 = mock<Customer>();
    mockCustomer4.firstName = 'joe';
    mockCustomer4.surname = 'dcf';

    const definition = generateDeliveryPlanDocumentDefinition(
      [
        { customer: mockCustomer2, deliveries: ['paused', 'paused', 'paused'] },
        { customer: mockCustomer1, deliveries: ['paused', 'paused', 'paused'] },
        { customer: mockCustomer3, deliveries: ['paused', 'paused', 'paused'] },
        { customer: mockCustomer4, deliveries: ['paused', 'paused', 'paused'] },
      ],
      [],
      mock()
    );

    if (Array.isArray(definition.content)) {
      const table = definition.content.find(
        (thing) => isTable(thing) && thing.table
      );

      if (table && isTable(table)) {
        expect(
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          (table.table.body[0][0] as any).text[0].text.startsWith('abc')
        ).toBeTruthy();
        expect(
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          (table.table.body[1][0] as any).text[0].text.startsWith('dcf')
        ).toBeTruthy();
        expect(
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          (table.table.body[2][0] as any).text[0].text.startsWith('def')
        ).toBeTruthy();
        expect(
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          (table.table.body[3][0] as any).text[0].text.startsWith('gef')
        ).toBeTruthy();
      }
    }

    expect.hasAssertions();
  });
});
