export function callWithTimeout<T>(
  call: Promise<T>,
  timeout: number,
  timeoutErrorMessage: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    let callAttempt = call;

    let timeoutId = setTimeout(() => {
      reject(new Error(timeoutErrorMessage));
    }, timeout);

    callAttempt
      .then((res) => {
        clearTimeout(timeoutId);
        resolve(res);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

