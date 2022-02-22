export const getEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`process.env.${name} was not configured`);
  }

  return value;
};
