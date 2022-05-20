import {
  WalletName,
  WalletReadyState,
  BaseMessageSignerWalletAdapter,
  WalletAdapterNetwork,
  WalletError,
} from "@solana/wallet-adapter-base";
import {
  Keypair,
  PublicKey,
  SendOptions,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";
import { getConnectURL } from "../methods/connect";
import { getDisconnectURL } from "methods/disconnect";
import { registerTimeout } from "../utils";
import bs58 from "bs58";
import {
  PhantomRedirectAdapterConfig,
  PhantomErrorResponse,
  RedirectURLs,
} from "../types";
import nacl from "tweetnacl";
import PhantomError from "types/errors";
import { signAndSendTransactionURL } from "methods/signAndSendTransaction";
import { signMessageURL } from "../methods/signMessage";
import { signTransactionURL } from "../methods/signTransaction";
import { connect } from "http2";

export const PhantomWalletName = "Phantom" as WalletName;

export class PhantomState {
  // These properties are for the WalletProvider React component
  name = PhantomWalletName;
  icon =
    "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjM0IiB3aWR0aD0iMzQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iLjUiIHgyPSIuNSIgeTE9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1MzRiYjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM1NTFiZjkiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9Ii41IiB4Mj0iLjUiIHkxPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9Ii44MiIvPjwvbGluZWFyR3JhZGllbnQ+PGNpcmNsZSBjeD0iMTciIGN5PSIxNyIgZmlsbD0idXJsKCNhKSIgcj0iMTciLz48cGF0aCBkPSJtMjkuMTcwMiAxNy4yMDcxaC0yLjk5NjljMC02LjEwNzQtNC45NjgzLTExLjA1ODE3LTExLjA5NzUtMTEuMDU4MTctNi4wNTMyNSAwLTEwLjk3NDYzIDQuODI5NTctMTEuMDk1MDggMTAuODMyMzctLjEyNDYxIDYuMjA1IDUuNzE3NTIgMTEuNTkzMiAxMS45NDUzOCAxMS41OTMyaC43ODM0YzUuNDkwNiAwIDEyLjg0OTctNC4yODI5IDEzLjk5OTUtOS41MDEzLjIxMjMtLjk2MTktLjU1MDItMS44NjYxLTEuNTM4OC0xLjg2NjF6bS0xOC41NDc5LjI3MjFjMCAuODE2Ny0uNjcwMzggMS40ODQ3LTEuNDkwMDEgMS40ODQ3LS44MTk2NCAwLTEuNDg5OTgtLjY2ODMtMS40ODk5OC0xLjQ4NDd2LTIuNDAxOWMwLS44MTY3LjY3MDM0LTEuNDg0NyAxLjQ4OTk4LTEuNDg0Ny44MTk2MyAwIDEuNDkwMDEuNjY4IDEuNDkwMDEgMS40ODQ3em01LjE3MzggMGMwIC44MTY3LS42NzAzIDEuNDg0Ny0xLjQ4OTkgMS40ODQ3LS44MTk3IDAtMS40OS0uNjY4My0xLjQ5LTEuNDg0N3YtMi40MDE5YzAtLjgxNjcuNjcwNi0xLjQ4NDcgMS40OS0xLjQ4NDcuODE5NiAwIDEuNDg5OS42NjggMS40ODk5IDEuNDg0N3oiIGZpbGw9InVybCgjYikiLz48L3N2Zz4K";
  
  // computed / acquired later ------------------------------------------
  private _session: string | null = null;
  private _sharedSecret: Uint8Array | null = null;
  private _phantomEncryptionPublicKey: Uint8Array | null = null;
  
  // Developer input ----------------------------------------------------
  private _dappEncryptionKeyPair: nacl.BoxKeyPair;
  private _redirectURLs: RedirectURLs;
  private _appURL: string;
  private _network: WalletAdapterNetwork;

  constructor(config: PhantomRedirectAdapterConfig) {
    this._appURL = config.appURL;
    this._network = config.network || WalletAdapterNetwork.Mainnet;

    this._redirectURLs = config.redirectURLs || {
      connect: `${window.location.host}/onConnect`,
      disconnect: `${window.location.host}/onDisconnect`,
      signAllTransactions: `${window.location.host}/onSignAllTransactions`,
      signAndSendTransaction: `${window.location.host}/onSignAndSendTransaction`,
      signMessage: `${window.location.host}/onSignMessage`,
      signTransaction: `${window.location.host}/onSignTransaction`,
    };

    this.loadState();

    if (!this._dappEncryptionKeyPair && config.dappEncryptionKeyPair) {
      this._dappEncryptionKeyPair = config.dappEncryptionKeyPair;
    }
  }

  private retrieveOrGenerateAndStoreEncryptionKeyPair(): nacl.BoxKeyPair {
    const kp = nacl.box.keyPair();
    const storedKeyPair = JSON.parse(
      localStorage.getItem("dappKeyPair") || "{}"
    );
    if (storedKeyPair.publicKey && storedKeyPair.secretKey) {
      kp.publicKey = bs58.decode(storedKeyPair.publicKey);
      kp.secretKey = bs58.decode(storedKeyPair.secretKey);

      return kp;
    }

    localStorage.setItem(
      "dappKeyPair",
      JSON.stringify({
        publicKey: bs58.encode(kp.publicKey),
        secretKey: bs58.encode(kp.secretKey),
      })
    );
    return kp;
  }

  private retrieveOrParseAndStorePhantomPublicKey(
    phantomPublicKeyB58?: string
  ) {
    if (phantomPublicKeyB58) {
      const phantomPublicKey = bs58.decode(phantomPublicKeyB58);
      localStorage.setItem("phantomEncryptionPublicKey", phantomPublicKeyB58);
      return phantomPublicKey.length > 0 ? phantomPublicKey : phantomPublicKey;
    }

    const decodedPhantomPublicKey = bs58.decode(
      localStorage.getItem("phantomEncryptionPublicKey") || ""
    );
    const storedPhantomPublicKey =
      decodedPhantomPublicKey.length > 0 ? decodedPhantomPublicKey : null;

    return storedPhantomPublicKey;
  }

  private decryptPayload(
    data: string,
    nonce: string,
    sharedSecret: Uint8Array
  ) {
    const decryptedData = nacl.box.open.after(
      bs58.decode(data),
      bs58.decode(nonce),
      sharedSecret
    );
    if (!decryptedData) {
      throw new Error("Unable to decrypt data");
    }
    return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
  }

  private encryptPayload(payload: Object, sharedSecret: Uint8Array) {
    const nonce = nacl.randomBytes(24);

    const encryptedPayload = nacl.box.after(
      Buffer.from(JSON.stringify(payload)),
      nonce,
      sharedSecret
    );

    return [nonce, encryptedPayload];
  }

  private clearState() {}
  private loadState() {
    this._publicKey = this._publicKey;

    this._session = localStorage.getItem("phantomAdapterSession");

    this._dappEncryptionKeyPair =
      this._dappEncryptionKeyPair ||
      this.retrieveOrGenerateAndStoreEncryptionKeyPair();
    // handle our dapp and phantom encryption keys
    this._phantomEncryptionPublicKey =
      this._phantomEncryptionPublicKey ||
      this.retrieveOrParseAndStorePhantomPublicKey();

    if (this._phantomEncryptionPublicKey) {
      this._sharedSecret = nacl.box.before(
        this._phantomEncryptionPublicKey,
        this._dappEncryptionKeyPair.secretKey
      );
    }
  }
  private saveState() {}

  async signAllTransactions (){
    if(!this._sharedSecret){
      return null
    }

    const transactions = await Promise.all([
      new Transaction(),
      new Transaction(),
    ]);

    const serializedTransactions = transactions.map((t) =>
    bs58.encode(
      t.serialize({
        requireAllSignatures: false,
      })
    )
  );

  const payload = {
    session: this._session,
    transactions: serializedTransactions,
  };

  const [nonce, encryptedPayload] = this.encryptPayload(payload, this._sharedSecret);

  
  }

  signTransactionURL(serializedTransaction: Buffer) {
    if (!this._phantomEncryptionPublicKey || !this._sharedSecret) {
      return null;
    }

    const payload = {
      session: this._session,
      transaction: bs58.encode(Buffer.from(serializedTransaction)),
    };

    const [nonce, encryptedPayload] = this.encryptPayload(
      payload,
      this._sharedSecret
    );

    return signTransactionURL({
      dapp_encryption_public_key: bs58.encode(this._phantomEncryptionPublicKey),
      nonce: bs58.encode(nonce),
      payload: bs58.encode(encryptedPayload),
      redirect_link: this._redirectURLs.signTransaction,
    });
  }

  signMessageUrl(message: string) {
    if (!this._sharedSecret || !this._session) {
      return null;
    }

    const payload = {
      session: this._session,
      message: bs58.encode(Buffer.from(message)),
    };

    const [nonce, encryptedPayload] = this.encryptPayload(
      payload,
      this._sharedSecret
    );

    return signMessageURL({
      dapp_encryption_public_key: bs58.encode(
        this._dappEncryptionKeyPair.publicKey
      ),
      nonce: bs58.encode(nonce),
      payload: bs58.encode(encryptedPayload),

      redirect_link: this._redirectURLs.signMessage,
    });
  }

  signAndSendTransactionURL(serializedTransaction: Buffer) {
    if (!this._sharedSecret) {
      return null;
    }

    const payload = {
      sesion: this._session,
      transaction: bs58.encode(serializedTransaction),
    };

    const [nonce, encryptedPayload] = this.encryptPayload(
      payload,
      this._sharedSecret
    );

    return signAndSendTransactionURL({
      dapp_encryption_public_key: bs58.encode(
        this._dappEncryptionKeyPair.publicKey
      ),
      nonce: bs58.encode(nonce),
      redirect_link: this._redirectURLs.signAndSendTransaction,
      payload: bs58.encode(encryptedPayload),
    });
  }

  get connectURL() {
    return getConnectURL({
      appURL: this._appURL,
      dappEncryptionPublicKey: bs58.encode(
        this._dappEncryptionKeyPair.publicKey
      ),
      redirectURL: this._redirectURLs?.connect,
      cluster: this._network,
    });
  }

  get disconnectURL() {
    if (!this._session || !this._sharedSecret) {
      return null;
    }

    return getDisconnectURL({
      dappEncryptionPublicKey: bs58.encode(
        this._dappEncryptionKeyPair.publicKey
      ),
      redirectURL: this._redirectURLs.disconnect!,
      session: this._session,
      sharedSecret: this._sharedSecret,
    });
  }
}
