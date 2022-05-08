import { Cluster } from '@solana/web3.js'
import axios from 'axios'
import { getBaseURL, PhantomErrorResponse } from './util'

export interface DisconnectParameters {
  dapp_encryption_public_key: string // The original encryption public key used from the app side for an existing Connect session.
  nonce: string // A nonce used for encrypting the request, encoded in base58.
  redirect_link: string // The URI where Phantom should redirect the user upon completion. Please review Specifying Redirects for more details.
  payload: string // An encrypted JSON string with the following fields:
  //   {
  //     "session": "...", // string: The session token received from the Connect method.
  // }
}

export interface DisconnectResponse {
  // No query params returned.
}

export function disconnect(params: DisconnectParameters) {
  const disconnectUrl = getBaseURL('disconnect')

  return axios.get<any, DisconnectResponse, PhantomErrorResponse>(disconnectUrl, {
    params
  })
}

export default disconnect
