import tracer, { Span, SpanContext } from 'dd-trace';

tracer.init();

interface ContextWithStartedExposed extends SpanContext {
  _trace: {
    started: Span[];
  };
}

export const setTag = (key: string, value: unknown) => {
  const span = tracer.scope().active();

  if (span !== null) {
    span.setTag(key, value);
  }
};

const assertsHasUnderscoreTrace: (
  context: SpanContext
) => asserts context is ContextWithStartedExposed = (context) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contextAny = context as any;

  const errorMessage =
    'Tried to get service entry tag in order to set a tag using an undocumented API. That API now no longer appears to exist';

  if (!contextAny._trace) {
    throw new Error(errorMessage);
  }

  if (!contextAny._trace.started) {
    throw new Error(errorMessage);
  }
};

export const setErrorOnServiceEntrySpan = (error: Error) => {
  const context = tracer.scope().active()?.context();

  if (context) {
    assertsHasUnderscoreTrace(context);

    const serviceEntry = context._trace.started[0];
    const typeNames = error.message.match(/\w*(Error|Exception)/gm);
    if (typeNames) {
      serviceEntry.setTag('error.type', typeNames[0]);
    }
    serviceEntry.setTag('error.message', error.message);
    serviceEntry.setTag('error.stack', error.stack);
  }
};
