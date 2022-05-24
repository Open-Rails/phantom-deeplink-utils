import { Cluster } from "@solana/web3.js";
import axios from "axios";
import { getBaseURL } from "../utils";
import { decryptPayload } from "../utils/index";

export interface SignTransactionParameters {
  dapp_encryption_public_key: string  //(required): The original encryption public key used from the app side for an existing Connect session.
  nonce: string  //(required): A nonce used for encrypting the request, encoded in base58.
  redirect_link: string  //(required): The URI where Phantom should redirect the user upon completion. Please review Specifying Redirects for more details.
  payload: string  //: string required): An encrypted JSON string with the following fields:
  // {
  //   "message": "...", // the message, base58 encoded
  //   "session": "...", // token received from connect-method
  //   "display": "utf8" | "hex", // the encoding to use when displaying the message 
  // }
  // message //(required): The message that should be signed by the user, encoded in base58. Phantom will display this message to the user when they are prompted to sign.
  // session //(required): The session token received from the Connect method. Please see Handling Sessions for more details.
  // display //(optional): How you want us to display the string to the user. Defaults to utf8
}

export interface SignTransactionResponse {
  nonce: string; // A nonce used for encrypting the response, encoded in base58.
  data: string; // An encrypted JSON string. Refer to Encryption to learn how apps can decrypt data using a shared secret. Encrypted bytes are encoded in base58.
  // content of decrypted `data`-parameter
  // {
  //   "signature": "..." // transaction-signature
  // }
  // signature: string // The first signature in the transaction, which can be used as its transaction id.
}

export const signTransactionURL = (
  params: SignTransactionParameters
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
