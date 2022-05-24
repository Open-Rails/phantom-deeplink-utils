import {
  WalletAdapterNetwork,
} from "@solana/wallet-adapter-base";
import {

  Transaction,
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
import { signAndSendTransactionURL } from "methods/signAndSendTransaction";
import { signMessageURL } from "../methods/signMessage";
import { signTransactionURL } from "../methods/signTransaction";

export class PhantomStateManager {
  // computed / acquired later ------------------------------------------
  private _session: string | null = null;
  private _sharedSecret: Uint8Array | null = null;
  private _phantomEncryptionPublicKey: Uint8Array | null = null;
  
  // Developer input ----------------------------------------------------
  private _dappEncryptionKeyPair: nacl.BoxKeyPair;
  private _redirectURLs: RedirectURLs;
  private _appURL: string;
  private _network: WalletAdapterNetwork;

  constructor(config: PhantomRedirectAdapterConfig, private _localStorageKeyBuilder =(keyName: string)=>{ return `PDB-${keyName}`}) {
    // Fill in config with default values and generate connectURL
    this._appURL = config.appURL || window.location.origin;
    this._dappEncryptionKeyPair =
      config.dappEncryptionKeyPair ||
      this.retrieveOrGenerateAndStoreEncryptionKeyPair();
    this._network = config.network || WalletAdapterNetwork.Mainnet;
    this._redirectURLs = config.redirectURLs || {
      connect: `${window.location.host}/onConnect`,
      disconnect: `${window.location.host}/onDisconnect`,
      signAllTransactions: `${window.location.host}/onSignAllTransactions`,
      signAndSendTransaction: `${window.location.host}/onSignAndSendTransaction`,
      signMessage: `${window.location.host}/onSignMessage`,
      signTransaction: `${window.location.host}/onSignTransaction`,
    };

    // Handle a response-redirect. This will parse the query-params and update our adapter's state
    if (config.redirectURLs) this._redirectURLs = config.redirectURLs;
    const urlParams = new URLSearchParams(location.search);

    // handle our dapp and phantom encryption keys
    this._phantomEncryptionPublicKey = this.retrieveOrParseAndStorePhantomPublicKey(
      urlParams.get("phantom_encryption_public_key") || undefined
    );


    // Set final properties
    this._session = localStorage.getItem("phantomAdapterSession");

    const publicKeyString = localStorage.getItem("phantomWalletPublicKey");

    if (this._phantomEncryptionPublicKey) {
      this._sharedSecret = nacl.box.before(
        this._phantomEncryptionPublicKey,
        this._dappEncryptionKeyPair.secretKey
      );
    }

    // Set final properties
    this._session = localStorage.getItem("phantomAdapterSession");

    if (this._phantomEncryptionPublicKey) {
      this._sharedSecret = nacl.box.before(
        this._phantomEncryptionPublicKey,
        this._dappEncryptionKeyPair.secretKey
      );
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

    const [nonce, encryptedPayload] = this.encryptPayload({
      session: this._session
    },this._sharedSecret)


    return getDisconnectURL({
      dapp_encryption_public_key: bs58.encode(this._dappEncryptionKeyPair.publicKey),
      redirect_link: this._redirectURLs.disconnect!,
      payload,
      nonce
      // : this._sharedSecret,
    });
  }
}
