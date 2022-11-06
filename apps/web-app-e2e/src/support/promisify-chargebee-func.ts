type ChargeBeeFunc<T, R> = (input: T) => {
  request: (callback: (error: Error, result: R) => void) => void;
};

export const promisifyChargebeeFunc = <T, R>(func: ChargeBeeFunc<T, R>) => {
  return (input: T) => {
    return new Promise((accept, reject) => {
      func(input).request((error, response) => {
        if (error) {
          reject(error);
        } else {
          accept(response);
        }
      });
    });
  };
};
