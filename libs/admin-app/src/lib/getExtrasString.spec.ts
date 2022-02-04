import Customer, { Snack } from '../domain/Customer';
import getExtrasString from './getExtrasString';
import { mock } from 'jest-mock-extended';

describe('getExtrasString', () => {
  it("Returns 'breakfast' if only the breakfast flag is set", () => {
    const customer = mock<Customer>();

    customer.breakfast = true;
    customer.snack = Snack.None;

    const actual = getExtrasString(customer);

    expect(actual).toEqual('Breakfast');
  });

  it("Returns 'None' if nothing is set", () => {
    const customer = mock<Customer>();

    customer.breakfast = false;
    customer.snack = Snack.None;

    const actual = getExtrasString(customer);

    expect(actual).toEqual('None');
  });

  it("Returns 'Large Snack' if just a large snack is set", () => {
    const customer = mock<Customer>();

    customer.breakfast = false;
    customer.snack = Snack.Large;

    const actual = getExtrasString(customer);

    expect(actual).toEqual('Large Snack');
  });

  it("Returns 'Breakfast, Standard Snack' if both are set", () => {
    const customer = mock<Customer>();

    customer.breakfast = true;
    customer.snack = Snack.Standard;

    const actual = getExtrasString(customer);

    expect(actual).toEqual('Breakfast, Standard Snack');
  });
});
