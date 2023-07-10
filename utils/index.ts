import { ToastPosition } from "@chakra-ui/react";

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

export const mapToOptions: (
  list: string[]
) => { label: string; value: string }[] = (list) => {
  return list.map((item) => ({
    label: item,
    value: item,
  }));
};

export const defaultToastProps = {
  position: "top" as ToastPosition,
  duration: 4000,
  isClosable: true,
};
