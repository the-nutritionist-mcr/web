export const removeNullish = <T extends unknown[]>(array: T) => {
  return array.flatMap((item) => (item ? [item] : []));
};
