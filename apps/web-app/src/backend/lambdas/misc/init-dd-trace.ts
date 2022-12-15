import tracer from 'dd-trace';

tracer.init();
// eslint-disable-next-line unicorn/prefer-export-from

export const setTag = (key: string, value: unknown) => {
  const span = tracer.scope().active();
  if (span !== null) {
    span.setTag(key, value);
  }
};
