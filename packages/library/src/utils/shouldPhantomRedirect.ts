import mobile from 'is-mobile'

declare const window: WindowSolana

export default function shouldPhantomRedirect() {
  if (window?.solana?.isPhantom) return false
  if (!mobile()) return false

  return true
}
