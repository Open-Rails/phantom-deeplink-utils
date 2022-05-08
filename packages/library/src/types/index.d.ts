import { PhantomRedirectAdapter } from '../adapter'

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
