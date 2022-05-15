import { PhantomRedirectAdapter } from '../adapter'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import nacl from 'tweetnacl'

export type RedirectURLs = {
  connect?: string
  disconnect?: string
  signAndSEndTransaction?: string
  signAllTransactions?: string
  signTransaction?: string
  signMessage?: string
}

export interface PhantomRedirectAdapterConfig {
  // A url used to fetch app metadata (i.e. title, icon) using the same properties found in Displaying Your App.
  appURL?: string
  // A public key used for end-to-end encryption. This will be used to generate a shared secret.
  dappEncryptionKeyPair?: nacl.BoxKeyPair
  // The network that should be used for subsequent interactions. Can be either: mainnet-beta, testnet, or devnet. Defaults to mainnet-beta.
  network?: WalletAdapterNetwork
  // (The URL where Phantom should redirect the user dependent upon the method used
  redirectURLs?: RedirectURLs
}

export interface PhantomErrorResponse {
  code: number
  message: string
}

export interface PhantomEvents {
  connect(...args: unknown[]): unknown
  disconnect(...args: unknown[]): unknown
}

declare global {
  interface WindowSolana extends Window {
    solana?: PhantomRedirectAdapter
  }
}

declare const window: WindowSolana
