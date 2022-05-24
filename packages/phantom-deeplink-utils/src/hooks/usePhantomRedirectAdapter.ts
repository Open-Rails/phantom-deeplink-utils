import { PhantomRedirectAdapter } from '../adapter'
import { PhantomRedirectAdapterConfig } from '../types'
import mobile from 'is-mobile'

declare const window: WindowSolana

export default function usePhantomRedirectAdapter(config: PhantomRedirectAdapterConfig) {
  if (window?.solana) return window.solana
  if (!mobile()) return null // we only insert redirects in mobile browsers

  const redirectProvider = new PhantomRedirectAdapter(config)

  return (window.solana = redirectProvider)
}
