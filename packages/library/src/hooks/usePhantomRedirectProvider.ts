import phantomProvider from '../solana-provider'

type providerConfig = {
  host?: string
}

export default function usePhantomRedirectProvider(config: providerConfig) {
  if (!config.host) config.host = location.host

  // if (window.solana) return window.solana
  // else
  return (window.solana = phantomProvider)
}
