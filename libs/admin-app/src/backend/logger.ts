const doLog = (logItem: string | Record<string, unknown>): void => {
  const message =
    typeof logItem === "object" ? JSON.stringify(logItem) : logItem;
  // eslint-disable-next-line no-console
  console.log(message);
};

export const logger = {
  info: doLog
};
