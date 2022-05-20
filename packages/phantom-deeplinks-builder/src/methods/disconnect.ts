import { getBaseURL } from "../utils";
import bs58 from "bs58";

export interface DisconnectRequestParams {
  dapp_encryption_public_key: string; // (required): The original encryption public key used from the app side for an existing Connect session.
  nonce: string; // (required): A nonce used for encrypting the request, encoded in base58.
  redirect_link: string; // (required): The URI where Phantom should redirect the user upon completion. Please review Specifying Redirects for more details.
  payload: string; // (required): An encrypted JSON string with the following fields:
  // {
  //     "session": "...", // token received from the connect method
  // }
  session: string; // (required): The session token received from the Connect method. Please see Handling Sessions for more details.
}

export interface DisconnectResponse {
  // No query params returned.
}

export const getDisconnectURL = (params: DisconnectRequestParams) => {
  const baseUrl = getBaseURL("disconnect");

  const queryParams = new URLSearchParams({
    dapp_encryption_public_key: params.dapp_encryption_public_key,
    nonce: params.nonce,
    redirect_link: params.redirect_link,
    payload: params.payload,
    session: params.session,
  });

  return `${baseUrl}?${queryParams.toString()}`;
};

export const handleDisconnectRedirect = () => {};
