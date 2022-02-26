import { transformPhoneNumberToCognitoFormat } from './transform-phone-number';

describe('transform phone number', () => {
  it('leaves + format phone numbers alone', () => {
    const number = '+447862491742';
    const result = transformPhoneNumberToCognitoFormat(number);

    expect(result).toEqual(number);
  });

  it('transforms normal numbers to +44 format', () => {
    const number = '07862491742';
    const result = transformPhoneNumberToCognitoFormat(number);

    expect(result).toEqual('+447862491742');
  });

  it('trims whitespace', () => {
    const number = ' 07862491742 ';
    const result = transformPhoneNumberToCognitoFormat(number);

    expect(result).toEqual('+447862491742');
  });

  it('removes non numeric chars', () => {
    const number = '+447862-491-742';
    const result = transformPhoneNumberToCognitoFormat(number);

    expect(result).toEqual('+447862491742');
  });
});
