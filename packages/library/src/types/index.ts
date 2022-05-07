export {}

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean
      isRedirectFlow?: boolean
    }
  }
}
