import { getBaseURL } from "../utils";


export interface SignAllTransactionsParameters {
  dapp_encryption_public_key: string; // (required): A public key used for end-to-end encryption. This will be used to generate a shared secret. For more information on how Phantom handles shared secrets, please review Encryption.
  nonce: string; // (required): A nonce used for encrypting the request, encoded in base58.
  redirect_link: string; // (required): The URI where Phantom should redirect the user upon connection. Please review Specifying Redirects for more details.
  payload : string //(required): An encrypted JSON string with the following fields:
  // {
  //   "transactions": [
  //     "...", // serialized transaction, bs58-encoded
  //     "...", // serialized transaction, bs58-encoded
  //   ],
  //   "session": "...", // token received from connect-method
  // }
  // transactions (required): An array of transactions that Phantom will sign, serialized and encoded in base58.
  // session (required): The session token received from the Connect method. Please see Handling Sessions for more details.
}

export interface SignAllTransactionsResponse {
  nonce: string; // A nonce used for encrypting the response, encoded in base58.
  data: string; // An encrypted JSON string. Refer to Encryption to learn how apps can decrypt data using a shared secret. Encrypted bytes are encoded in base58.
  // content of decrypted `data`-parameter
  // {
  //   "signature": "..." // transaction-signature
  // }
  // signature: string // The first signature in the transaction, which can be used as its transaction id.
}

export const signAndSendTransactionURL = (
  params: SignAllTransactionsParameters
) => {
  const signAndSendURL = getBaseURL("signAllTransactions");

  const queryParams = new URLSearchParams();
  queryParams.append(
    "dapp_encryption_public_key",
    params.dapp_encryption_public_key
  );
  queryParams.append("redirect_link", params.redirect_link);
  queryParams.append("nonce", params.nonce);
  queryParams.append("payload", params.payload);

  return `${signAndSendURL}?${queryParams.toString()}`;
};
