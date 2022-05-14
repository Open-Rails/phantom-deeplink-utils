import {
  WalletName,
  WalletReadyState,
  BaseMessageSignerWalletAdapter,
  WalletAdapterNetwork,
  WalletError
} from '@solana/wallet-adapter-base'
import { PublicKey, SendOptions, Transaction, TransactionSignature } from '@solana/web3.js'
import { getConnectURL } from '../methods/connect'
import { getDisconnectURL } from 'methods/disconnect'
import {
  registerTimeout,
  retrieveOrGenerateAndStoreEncryptionKeyPair,
  retrieveOrParseAndStorePhantomPublicKey
} from '../utils'
import bs58 from 'bs58'
import { PhantomRedirectAdapterConfig, PhantomErrorResponse, RedirectURLs } from '../types'
import nacl from 'tweetnacl'
import PhantomError from 'types/errors'

// Notes:

// wallet._handleDisconnect does nothing in our function
// connect() can reject and return 'reason' which should be an instance of WalletError
// the other methods can throw as well, and return an 'any' error type

// events emitted: 'connect', 'disconnect'

export const PhantomWalletName = 'Phantom' as WalletName

export class PhantomCoreProvider extends BaseMessageSignerWalletAdapter {
  // These properties are for the WalletProvider React component
  name = PhantomWalletName
  icon =
    'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjM0IiB3aWR0aD0iMzQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iLjUiIHgyPSIuNSIgeTE9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1MzRiYjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM1NTFiZjkiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9Ii41IiB4Mj0iLjUiIHkxPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9Ii44MiIvPjwvbGluZWFyR3JhZGllbnQ+PGNpcmNsZSBjeD0iMTciIGN5PSIxNyIgZmlsbD0idXJsKCNhKSIgcj0iMTciLz48cGF0aCBkPSJtMjkuMTcwMiAxNy4yMDcxaC0yLjk5NjljMC02LjEwNzQtNC45NjgzLTExLjA1ODE3LTExLjA5NzUtMTEuMDU4MTctNi4wNTMyNSAwLTEwLjk3NDYzIDQuODI5NTctMTEuMDk1MDggMTAuODMyMzctLjEyNDYxIDYuMjA1IDUuNzE3NTIgMTEuNTkzMiAxMS45NDUzOCAxMS41OTMyaC43ODM0YzUuNDkwNiAwIDEyLjg0OTctNC4yODI5IDEzLjk5OTUtOS41MDEzLjIxMjMtLjk2MTktLjU1MDItMS44NjYxLTEuNTM4OC0xLjg2NjF6bS0xOC41NDc5LjI3MjFjMCAuODE2Ny0uNjcwMzggMS40ODQ3LTEuNDkwMDEgMS40ODQ3LS44MTk2NCAwLTEuNDg5OTgtLjY2ODMtMS40ODk5OC0xLjQ4NDd2LTIuNDAxOWMwLS44MTY3LjY3MDM0LTEuNDg0NyAxLjQ4OTk4LTEuNDg0Ny44MTk2MyAwIDEuNDkwMDEuNjY4IDEuNDkwMDEgMS40ODQ3em01LjE3MzggMGMwIC44MTY3LS42NzAzIDEuNDg0Ny0xLjQ4OTkgMS40ODQ3LS44MTk3IDAtMS40OS0uNjY4My0xLjQ5LTEuNDg0N3YtMi40MDE5YzAtLjgxNjcuNjcwNi0xLjQ4NDcgMS40OS0xLjQ4NDcuODE5NiAwIDEuNDg5OS42NjggMS40ODk5IDEuNDg0N3oiIGZpbGw9InVybCgjYikiLz48L3N2Zz4K'
  url: string // directs users to this url if WalletReadyState == NotDetected
  private _readyState: WalletReadyState = WalletReadyState.NotDetected

  private _connecting: boolean = false
  private _publicKey: PublicKey | null = null
  private _session: string | null = null
  private _dappEncryptionKeyPair: nacl.BoxKeyPair
  private _phantomEncryptionPublicKey: Uint8Array | null = null
  private _sharedSecret: Uint8Array | null = null
  isPhantom: boolean = true
  isConnected: boolean = false
  response: Object | null = null
  private _redirectURLs: RedirectURLs
  private _appURL: string
  private _cluster: WalletAdapterNetwork
  // private _wallet: PhantomWallet | null

  constructor(config: PhantomRedirectAdapterConfig = {}) {
    super()
    // WalletProvider stores the user's preference for wallets in this localStorage key-value pair
    // Erasing this prevents WalletProvider's aggressive reconnect behavior
    // if (localStorage.getItem('walletName') === 'Phantom') localStorage.removeItem('walletName')

    // Fill in config with default values and generate connectURL
    this._appURL = config.appURL || window.location.origin
    this._dappEncryptionKeyPair =
      config.dappEncryptionKeyPair || retrieveOrGenerateAndStoreEncryptionKeyPair()
    this._cluster = config.cluster || WalletAdapterNetwork.Mainnet
    this._redirectURLs = config.redirectURLs || {}

    this.url = getConnectURL({
      appURL: this._appURL,
      dappEncryptionPublicKey: bs58.encode(this._dappEncryptionKeyPair.publicKey),
      redirectURL: this._redirectURLs?.connect || window.location.toString(),
      cluster: this._cluster
    })

    // Handle a response-redirect. This will parse the query-params and update our adapter's state
    if (config.redirectURLs) this._redirectURLs = config.redirectURLs
    const urlParams = new URLSearchParams(location.search)

    // handle our dapp and phantom encryption keys
    this._phantomEncryptionPublicKey = retrieveOrParseAndStorePhantomPublicKey(
      urlParams.get('phantom_encryption_public_key') || undefined
    )

    const nonceString = urlParams.get('nonce')
    const dataString = urlParams.get('data')

    if (nonceString && dataString && this._phantomEncryptionPublicKey) {
      const decryptedData = nacl.box.open(
        bs58.decode(dataString),
        bs58.decode(nonceString),
        this._phantomEncryptionPublicKey,
        this._dappEncryptionKeyPair.secretKey
      )

      if (decryptedData) {
        const textDecoder = new TextDecoder('utf-8')
        const data = JSON.parse(textDecoder.decode(decryptedData))

        // Connect Method Response
        if (data.session && data.public_key) {
          localStorage.setItem('phantomAdapterSession', data.session)
          localStorage.setItem('phantomWalletPublicKey', data.public_key)
          this.emit('connect', new PublicKey(data.public_key))

          // TODO fill in this response
          this.response = {}
        }

        // SignAndSendTransaction Method Response, or SignMessageResponse
        if (data.signature) {
        }

        // SignAllTransactions Method Response
        if (data.transactions && Array.isArray(data.transactions)) {
        }

        // SignTransaction Method Response
        if (data.transactions && typeof data.transactions === 'string') {
        }
      }
    }

    // Set final properties
    const sessionString = localStorage.getItem('phantomAdapterSession')
    if (sessionString) this._session = sessionString

    const publicKeyString = localStorage.getItem('phantomWalletPublicKey')
    if (publicKeyString) this._publicKey = new PublicKey(publicKeyString)

    if (this._phantomEncryptionPublicKey) {
      this._sharedSecret = nacl.box.before(
        this._phantomEncryptionPublicKey,
        this._dappEncryptionKeyPair.secretKey
      )
    }

    if (this._sharedSecret && this._session) this.isConnected = true

    // handle phantom error responses
    const errorCode = urlParams.get('errorCode')
    const errorMessage = urlParams.get('errorMessage')
    if (errorCode && errorMessage) {
      // TODO: throw error
    }
  }

  get publicKey(): PublicKey | null {
    return this._publicKey
  }

  get connecting(): boolean {
    return this._connecting
  }

  get connected(): boolean {
    return !!this.isConnected
  }

  get readyState(): WalletReadyState {
    return this._readyState
  }

  // If this is being used within the React WalletContext component, and autoConnect is on,
  // and the user has connected to this wallet before, autoConnect is quite aggressive and
  // will call this function many times. Fortunately the browser will not open pop-up windows
  // without user interaction first
  connect(): Promise<void> {
    console.log('connect method within adapter called')

    // this promise will never resolve because we are redirected
    return new Promise<void>((resolve, reject) => {
      this._connecting = true

      const url = getConnectURL({
        appURL: this._appURL,
        dappEncryptionPublicKey: bs58.encode(this._dappEncryptionKeyPair.publicKey),
        redirectURL: this._redirectURLs?.connect || window.location.toString(),
        cluster: this._cluster
      })

      registerTimeout(PhantomError.INTERNAL_ERROR, reject)

      window.location.replace(url)
    })
  }

  disconnect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this._session || !this._sharedSecret) throw PhantomError.INVALID_INPUT

      const url = getDisconnectURL({
        dappEncryptionPublicKey: bs58.encode(this._dappEncryptionKeyPair.publicKey),
        redirectURL: this._redirectURLs?.disconnect || window.location.toString(),
        session: this._session,
        sharedSecret: this._sharedSecret
      })

      registerTimeout(PhantomError.INTERNAL_ERROR, reject)

      // remove variables from memory and storage
      this.isConnected = false
      this._publicKey = null
      this._session = null
      this._phantomEncryptionPublicKey = null
      this._sharedSecret = null
      localStorage.removeItem('phantomEncryptionPublicKey')
      localStorage.removeItem('phantomAdapterSession')
      localStorage.removeItem('phantomWalletPublicKey')

      window.location.replace(url)
    })
  }

  signTransaction(transaction: Transaction): Promise<Transaction> {
    return new Promise<Transaction>((resolve, reject) => {
      resolve(new Transaction())
    })
  }

  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    return new Promise<Transaction[]>((resolve, reject) => {
      resolve([new Transaction()])
    })
  }

  signAndSendTransaction(
    transaction: Transaction,
    options?: SendOptions
  ): Promise<{ signature: TransactionSignature }> {
    return new Promise((resolve, reject) => {
      resolve({ signature: '' })
    })
  }

  signMessage(message: Uint8Array): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      resolve(new Uint8Array())
    })
  }

  _handleDisconnect(...args: unknown[]): unknown {
    return
  }
}

const dappConfig = {
  app_url: 'ddd',
  dapp_encryption_public_key: 'ddddee',
  redirect_link: window.location.href
}

export class PhantomRedirectAdapter extends PhantomCoreProvider {
  isRedirectFlow?: boolean

  constructor(config: PhantomRedirectAdapterConfig = {}) {
    super(config)
    this.isRedirectFlow = true
  }

  request(request: Object): Promise<Object> {
    return new Promise((resolve, reject) => {
      resolve({})
    })
  }
}

export default PhantomRedirectAdapter
