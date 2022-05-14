import mobile from 'is-mobile'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { PhantomErrorResponse } from 'types'

declare const window: WindowSolana

export const getBaseURL = (method: string, version: string = 'v1') =>
  `https://phantom.app/ul/${version}/${method}`

export function shouldPhantomRedirect() {
  if (window?.solana?.isPhantom) return false
  if (!mobile()) return false

  return true
}

export function retrieveOrGenerateAndStoreEncryptionKeyPair() {
  const storedKeyPair = JSON.parse(localStorage.getItem('dappKeyPair') || '')
  if (storedKeyPair.publicKey && storedKeyPair.secretKey) {
    return storedKeyPair as nacl.BoxKeyPair
  }

  const keyPair = nacl.box.keyPair()
  localStorage.setItem('dappKeyPair', JSON.stringify(keyPair))
  return keyPair
}

export function retrieveOrParseAndStorePhantomPublicKey(phantomPublicKeyB58?: string) {
  if (phantomPublicKeyB58) {
    const phantomPublicKey = bs58.decode(phantomPublicKeyB58)
    localStorage.setItem('phantomEncryptionPublicKey', JSON.stringify(phantomPublicKey))
    return phantomPublicKey
  }

  const storedPhantomPublicKey = JSON.parse(
    localStorage.getItem('phantomEncryptionPublicKey') || ''
  )
  if (Array.isArray(storedPhantomPublicKey) && typeof storedPhantomPublicKey[0] === 'number')
    // @ts-ignore
    return storedPhantomPublicKey as Uint8Array

  return null
}

export const decryptPayload = (data: string, nonce: string, sharedSecret: Uint8Array) => {
  const decryptedData = nacl.box.open.after(bs58.decode(data), bs58.decode(nonce), sharedSecret)
  if (!decryptedData) {
    throw new Error('Unable to decrypt data')
  }
  return JSON.parse(Buffer.from(decryptedData).toString('utf8'))
}

export const encryptPayload = (payload: Object, sharedSecret: Uint8Array) => {
  const nonce = nacl.randomBytes(24)

  const encryptedPayload = nacl.box.after(Buffer.from(JSON.stringify(payload)), nonce, sharedSecret)

  return [nonce, encryptedPayload]
}

export const registerTimeout = (error: PhantomErrorResponse, reject: (reason?: any) => void) => {
  setTimeout(() => {
    reject(error)
  }, 2000)
}
