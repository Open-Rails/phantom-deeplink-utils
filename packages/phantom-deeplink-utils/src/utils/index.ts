import mobile from "is-mobile";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { PhantomErrorResponse } from "types";

declare const window: WindowSolana;

export const getBaseURL = (method: string, version: string = "v1") =>
  `https://phantom.app/ul/${version}/${method}`;

export function shouldPhantomRedirect() {
  // We need this to be true to debug lol
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  if (window?.solana?.isPhantom) return false;
  if (!mobile()) return false;

  return true;
}

export function retrieveOrGenerateAndStoreEncryptionKeyPair(): nacl.BoxKeyPair {
  const kp = nacl.box.keyPair();
  const storedKeyPair = JSON.parse(localStorage.getItem("dappKeyPair") || "{}");
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

export function retrieveOrParseAndStorePhantomPublicKey(
  phantomPublicKeyB58?: string
) {
  if (phantomPublicKeyB58) {
    const phantomPublicKey = bs58.decode(phantomPublicKeyB58);
    localStorage.setItem(
      "phantomEncryptionPublicKey",
      phantomPublicKeyB58
    );
    return phantomPublicKey.length > 0 ? phantomPublicKey : phantomPublicKey;
  }

  const decodedPhantomPublicKey =  bs58.decode(localStorage.getItem("phantomEncryptionPublicKey") || "")
  const storedPhantomPublicKey = decodedPhantomPublicKey.length > 0 ? decodedPhantomPublicKey : null
  
  return storedPhantomPublicKey;
}

export const decryptPayload = (
  data: string,
  nonce: string,
  sharedSecret: Uint8Array
) => {
  const decryptedData = nacl.box.open.after(
    bs58.decode(data),
    bs58.decode(nonce),
    sharedSecret
  );
  if (!decryptedData) {
    throw new Error("Unable to decrypt data");
  }
  return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
};

export const encryptPayload = (payload: Object, sharedSecret: Uint8Array) => {
  const nonce = nacl.randomBytes(24);

  const encryptedPayload = nacl.box.after(
    Buffer.from(JSON.stringify(payload)),
    nonce,
    sharedSecret
  );

  return [nonce, encryptedPayload];
};

export const registerTimeout = (
  error: PhantomErrorResponse,
  reject: (reason?: any) => void
) => {
  setTimeout(() => {
    reject(error);
  }, 2000);
};
