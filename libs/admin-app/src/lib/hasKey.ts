// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hasKey = <T>(object: T, key: keyof any): key is keyof T => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return key in object;
};

export default hasKey;
