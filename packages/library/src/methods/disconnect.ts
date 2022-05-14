import { Cluster } from '@solana/web3.js'
import nacl from 'tweetnacl'
import { encryptPayload, getBaseURL } from '../utils'
import { PhantomErrorResponse } from '../types'
import bs58 from 'bs58'

export interface DisconnectRequest {
  dappEncryptionPublicKey: string // The original encryption public key used from the app side for an existing Connect session, base58 encoded
  redirectURL: string // The URI where Phantom should redirect the user upon completion.
  session: string // string: The session token received from the Connect method.
  sharedSecret: Uint8Array
}

export interface DisconnectResponse {
  // No query params returned.
}

export const getDisconnectURL = (params: DisconnectRequest) => {
  const baseUrl = getBaseURL('disconnect')
  const [nonce, encryptedPayload] = encryptPayload({ session: params.session }, params.sharedSecret)

  const queryParams = new URLSearchParams({
    dapp_encryption_public_key: params.dappEncryptionPublicKey,
    nonce: bs58.encode(nonce),
    redirect_link: params.redirectURL,
    payload: bs58.encode(encryptedPayload)
  })

  return `${baseUrl}?${queryParams.toString()}`
}
