export const transformPhoneNumberToCognitoFormat = (phoneNumber: string) => {
  const number = phoneNumber.trim();
  const rest = number.slice(1).replace(/\D/g, '');

  if (number.startsWith('+')) {
    return `+${rest}`;
  }

  if (number.startsWith('0')) {
    return `+44${rest}`;
  }

  return number;
};
