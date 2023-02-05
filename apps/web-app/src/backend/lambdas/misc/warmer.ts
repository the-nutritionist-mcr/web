import { Callback, Context, EventBridgeEvent, Handler } from 'aws-lambda';

export const warmer = <T extends Handler>(func: T) => {
  return (
    event: EventBridgeEvent<string, unknown>,
    context: Context,
    callback: Callback
  ) => {
    if (event.source === 'aws.events') {
      return;
    }

    return func(event, context, callback);
  };
};
