import { connect } from '../utils/connect'

declare global {
  interface Window {
    solana?: Object
  }
}

const dappConfig = {
  app_url: 'ddd',
  dapp_encryption_public_key: 'ddddee',
  redirect_link: window.location.href
}

const phantomProvider = {
  connect: () => {
    const { app_url, dapp_encryption_public_key, redirect_link } = dappConfig
    const query = { app_url, dapp_encryption_public_key, redirect_link }
    connect(query)
  },
  disconnect: () => {},
  isPhantom: true,
  isRedirectFlow: true, // the only property we add to phantom's interface
  openBridge: () => {},
  postMessage: () => {},
  request: () => {},
  signAllTransactions: () => {},
  signMessage: () => {},
  signTransaction: () => {},
  _checkIfValidRequestOrThrow: () => {},
  _events: {},
  _eventsCount: 0,
  _handleDisconnect: () => {},
  _handleMessage: () => {},
  _handleStreamDisconnect: () => {},
  _incomingJsonRpc: {
    _events: {},
    _eventsCount: 1,
    _maxListeners: undefined,
    _middleware: [() => {}]
  },
  _nextRequestId: 1,
  _outgoingJsonRpc: {
    _events: {},
    _eventsCount: 1,
    _maxListeners: undefined,
    _middleware: [() => {}]
  },
  _publicKey: null,
  _responseCallbacks: new Map()
}

export default phantomProvider
