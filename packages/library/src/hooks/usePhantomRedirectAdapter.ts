import { PhantomRedirectAdapterConfig, PhantomRedirectAdapter } from '../adapter'
import mobile from 'is-mobile'

declare const window: WindowSolana

export default function usePhantomRedirectAdapter(config: PhantomRedirectAdapterConfig) {
  if (window?.solana) return window.solana
  if (!mobile()) return null // we only insert redirects in mobile browsers

  if (!config.appUrl) config.appUrl = location.host

  const redirectProvider = new PhantomRedirectAdapter(config)

  return (window.solana = redirectProvider)
}
