import { PhantomErrorResponse } from "types";

export const getBaseURL = (method: string, version: string = "v1") =>
  `https://phantom.app/ul/${version}/${method}`;

export const registerTimeout = (
  error: PhantomErrorResponse,
  reject: (reason?: any) => void
) => {
  setTimeout(() => {
    reject(error);
  }, 2000);
};
