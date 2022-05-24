import { getBaseURL } from "../utils";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export interface ConnectRequest {
  appURL: string;
  dappEncryptionPublicKey: string;
  redirectURL: string;
  cluster?: WalletAdapterNetwork;
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
  queryParams.append("app_url", params.appURL);
  queryParams.append(
    "dapp_encryption_public_key",
    params.dappEncryptionPublicKey
  );
  queryParams.append("redirect_link", params.redirectURL);
  if (params.cluster) queryParams.append("cluster", params.cluster);

  return `${baseUrl}?${queryParams.toString()}`;
};
