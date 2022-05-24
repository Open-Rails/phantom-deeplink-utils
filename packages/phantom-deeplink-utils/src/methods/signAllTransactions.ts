import { Cluster } from "@solana/web3.js";
import axios from "axios";
import { getBaseURL } from "../utils";
import { decryptPayload } from "../utils/index";

export interface SignAndSendTransactionParameters {
  dapp_encryption_public_key: string; // (required): A public key used for end-to-end encryption. This will be used to generate a shared secret. For more information on how Phantom handles shared secrets, please review Encryption.
  nonce: string; // (required): A nonce used for encrypting the request, encoded in base58.
  redirect_link: string; // (required): The URI where Phantom should redirect the user upon connection. Please review Specifying Redirects for more details.
  payload: string; // (required): An encrypted JSON string with the following fields:
  // {
  //   "transaction": "...", // serialized transaction, base58-encoded
  //   "session": "...", // token received from the connect method
  // }
  // transaction (required): The transaction that Phantom will sign and submit, serialized and encoded in base58.
  // session (required): The session token received from the Connect method. Please see Handling Sessions for more details.
}

export interface SignAndSendTransactionResponse {
  nonce: string; // A nonce used for encrypting the response, encoded in base58.
  data: string; // An encrypted JSON string. Refer to Encryption to learn how apps can decrypt data using a shared secret. Encrypted bytes are encoded in base58.
  // content of decrypted `data`-parameter
  // {
  //   "signature": "..." // transaction-signature
  // }
  // signature: string // The first signature in the transaction, which can be used as its transaction id.
}

export const signAndSendTransactionURL = (
  params: SignAndSendTransactionParameters
) => {
  const signAndSendURL = getBaseURL("signAndSendTransaction");

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

export const handleSignAndSendTransactionRedirect = (
  params: SignAndSendTransactionResponse,
  sharedSecred: Uint8Array
) => {
  const payload: { signature: string } = decryptPayload(
    params.data,
    params.nonce,
    sharedSecred
  );

  return payload;
};
