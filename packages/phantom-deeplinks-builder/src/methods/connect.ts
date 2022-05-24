import { getBaseURL } from "../utils";

export interface ConnectRequest {
  app_url: string; // (required): A url used to fetch app metadata (i.e. title, icon) using the same properties found in Displaying Your App.
  dapp_encryption_public_key: string; // (required): A public key used for end-to-end encryption. This will be used to generate a shared secret. For more information on how Phantom handles shared secrets, please review Encryption.
  redirect_link: string; // (required): The URI where Phantom should redirect the user upon connection. Please review Specifying Redirects for more details.
  cluster: string; // (optional): The network that should be used for subsequent interactions. Can be either: mainnet-beta, testnet, or devnet. Defaults to mainnet-beta.
}

export interface ConnectResponse {
  // An encryption public key used by Phantom for the construction of a shared secret between the connecting app and Phantom, encoded in base58.
  phantom_encryption_public_key: string;
  // A nonce used for encrypting the response, encoded in base58.
  nonce: string;
  //An encrypted JSON string. Encrypted bytes are encoded in base58. Must use the shared-secret to decrypt the data.
  data: string;

  // structure of decrypted data:
  decodedData: {
    // base58 encoding of user public key
    public_key: string;

    // session token for subsequent signatures and messages
    // dapps should send this with any other deeplinks after connect
    session: string;
  };
}

export const getConnectURL = (params: ConnectRequest) => {
  const baseUrl = getBaseURL("connect");

  const queryParams = new URLSearchParams();
  queryParams.append("app_url", params.app_url);
  queryParams.append(
    "dapp_encryption_public_key",
    params.dapp_encryption_public_key
  );
  queryParams.append("redirect_link", params.redirect_link);
  if (params.cluster) queryParams.append("cluster", params.cluster);

  return `${baseUrl}?${queryParams.toString()}`;
};
