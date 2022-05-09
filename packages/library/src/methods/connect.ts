import { Cluster } from '@solana/web3.js'
import axios from 'axios'
import { getBaseURL, PhantomErrorResponse } from './util'

export interface ConnectRequest {
  // A url used to fetch app metadata (i.e. title, icon) using the same properties found in Displaying Your App.
  app_url: string
  // A public key used for end-to-end encryption. This will be used to generate a shared secret.
  dapp_encryption_public_key: string
  // (The URI where Phantom should redirect the user upon connection.
  redirect_link: string
  // (optional): The network that should be used for subsequent interactions. Can be either: mainnet-beta, testnet, or devnet. Defaults to mainnet-beta.
  cluster?: Cluster
}

export interface ConnectResponse {
  // An encryption public key used by Phantom for the construction of a shared secret between the connecting app and Phantom, encoded in base58.
  phantom_encryption_public_key: string
  // A nonce used for encrypting the response, encoded in base58.
  nonce: string
  //An encrypted JSON string. Encrypted bytes are encoded in base58. Must use the shared-secret to decrypt the data.
  data: string

  // structure of decrypted data:
  decodedData: {
    // base58 encoding of user public key
    public_key: string

    // session token for subsequent signatures and messages
    // dapps should send this with any other deeplinks after connect
    session: string
  }
}

export const getConnectURL = (params: ConnectRequest) => {
  const baseUrl = getBaseURL('connect')

  const queryParams = new URLSearchParams()
  queryParams.append('app_url', params.app_url)
  queryParams.append('dapp_encryption_public_key', params.dapp_encryption_public_key)
  queryParams.append('redirect_link', params.redirect_link)
  if (params.cluster) queryParams.append('cluster', params.cluster)

  return `${baseUrl}?${queryParams.toString()}`
}

// export async function connect(params: ConnectRequest) {
//   const connectUrl = getBaseURL('connect')

//   return axios.get<any, ConnectResponse, PhantomErrorResponse>(connectUrl, { params }).then(res => {
//     // decode data here
//     console.log(res.data)

//     return res
//   })

export async function connect(params: ConnectRequest) {
  const connectURL = getConnectURL(params)

  console.log('connect() method called. URL: ', connectURL)

  window.location.replace(connectURL)
  // window.open(connectURL)
}

export default connect
