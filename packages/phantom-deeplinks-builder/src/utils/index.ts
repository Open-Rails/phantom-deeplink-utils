import mobile from "is-mobile";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { PhantomErrorResponse } from "types";

const LSKeys = {
  DAPP_ENCRYPTION_KEYPAIR: "dappKeyPair",

}

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
