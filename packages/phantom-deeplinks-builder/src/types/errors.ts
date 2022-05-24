export const PhantomError = {
  DISCONNECTED: {
    code: 4900,
    message: "Phantom could not connect to the network.",
  },
  UNAUTHORIZED: {
    code: 4100,
    message:
      "The requested method and/or account has not been authorized by the user.",
  },
  USER_REJECTED_REQUEST: {
    code: 4001,
    message: "The user rejected the request through Phantom.",
  },
  INVALID_INPUT: {
    code: -32000,
    message: "Missing or invalid parameters.",
  },
  TRANSACTION_REJECTED: {
    code: -32003,
    message: "Phantom does not recognize a valid transaction.",
  },
  METHOD_NOT_FOUND: {
    code: -32601,
    message: "Phantom does not recognize the method.",
  },
  INTERNAL_ERROR: {
    code: -32603,
    message: "Something went wrong within Phantom.",
  },
};

export default PhantomError;

export class PDLUError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
