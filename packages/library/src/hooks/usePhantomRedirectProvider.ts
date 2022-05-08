import { PhantomRedirectAdapterConfig, PhantomRedirectAdapter } from '../solana-provider'

declare const window: WindowSolana

export default function usePhantomRedirectAdapter(config: PhantomRedirectAdapterConfig) {
  if (!config.appUrl) config.appUrl = location.host

  // if (window.solana) return window.solana
  // else
  // const redirectProvider = new PhantomRedirectAdapter(config)
  // console.log('setting window solana object', redirectProvider)
  // return (window.solana = redirectProvider)

  return null
}
