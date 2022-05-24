import React from "react";
import { useLocation } from "react-router-dom";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { createAppUrl } from "./playground/routing";
import { PhantomStateManager } from "@openrails/phantom-deeplinks-builder";

const NETWORK = clusterApiUrl("mainnet-beta");

const onConnectRedirectLink = createAppUrl("onConnect");
const onDisconnectRedirectLink = createAppUrl("onDisconnect");
const onSignAndSendTransactionRedirectLink = createAppUrl(
  "onSignAndSendTransaction"
);
const onSignAllTransactionsRedirectLink = createAppUrl("onSignAllTransactions");
const onSignTransactionRedirectLink = createAppUrl("onSignTransaction");
const onSignMessageRedirectLink = createAppUrl("onSignMessage");

const App: React.FC = () => {
  return <Page />;
};

const MethodURL: React.FC<{
  methodName: React.ReactNode;
  methodURL: React.ReactNode;
}> = ({ methodName, methodURL }) => (
  <div>
    <span>{methodName}</span>
    <span>{methodURL}</span>
  </div>
);

const Page: React.FC = () => {
  const connection = React.useMemo(() => new Connection(NETWORK), []);
  const phantomStateManager = React.useMemo(() => {
    return new PhantomStateManager({});
  }, []);

  const createTransferTransaction = React.useCallback(async () => {
    const phantomWalletPublicKey = phantomStateManager.dappEncryptionPublicKey;

    if (!phantomWalletPublicKey)
      throw new Error("missing public key from user");
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: phantomWalletPublicKey,
        toPubkey: phantomWalletPublicKey,
        lamports: 100,
      })
    );
    transaction.feePayer = phantomWalletPublicKey;
    const anyTransaction: any = transaction;
    anyTransaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    return transaction;
  }, [connection, phantomStateManager]);

  const [messageToSign, setMessageToSign] = React.useState(
    "This is the message being signed"
  );


  const [transactionBuffer, setTransactionBuffer] = React.useState<Buffer>(Buffer.alloc(0))
    const [serializedTransactions, setSerializedTransactions] = React.useState<string[]>([])
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  React.useEffect(() => {
    if (!connection) {
      setTransactions([]);
      return;
    }

    Promise.all([
      createTransferTransaction(),
      createTransferTransaction(),
      createTransferTransaction(),
    ]).then((transactions => {
      
      const serializedTransactions = transactions.map((t) =>
      bs58.encode(
        t.serialize({
          requireAllSignatures: false,
        })
      )
    );

    setSerializedTransactions(serializedTransactions)
      setTransactionBuffer(transactions[0].serialize({requireAllSignatures: false}))
      setSerializedTransactions(serializedTransactions)
      setTransactions(transactions)}));
  }, [connection, createTransferTransaction]);

  return (
    <div>
      <div>
        <b>React Methods:</b>
      </div>
      <br />
      <div>
        <b>JavaScript Methods:</b>
        <div>
          <button
            onClick={async () => {
              // @ts-ignore
              const response = await window?.solana.connect();
              console.log(response);
            }}
          >
            Click to Connect Phantom
          </button>
        </div>
      </div>
      <br />
      <div>
        <b>RPC Methods:</b>

        <MethodURL
          methodName={"connect"}
          methodURL={phantomStateManager.connectURL}
        />
        <MethodURL
          methodName={"disconnect"}
          methodURL={phantomStateManager.disconnectURL}
        />
        <MethodURL
          methodName={"signAllTransactions"}
          methodURL={phantomStateManager.signAllTransactionsURL(serializedTransactions)}
        />
        <MethodURL
          methodName={"signAndSendTransactionURL"}
          methodURL={phantomStateManager.signAndSendTransactionURL(transactionBuffer)}
        />
        <MethodURL
          methodName={"signMessageUrl"}
          methodURL={phantomStateManager.signMessageUrl(messageToSign)}
        />
        <MethodURL
          methodName={"signTransactionURL"}
          methodURL={phantomStateManager.signTransactionURL(transactionBuffer)}
        />
      </div>
    </div>
  );
};

// const Content: React.FC = () => {
//   return (
//     <Routes>
//       <Route
//         path={AppRouting.ProviderInjection}
//         element={
//           <>
//             <WalletMultiButton />
//             {`Solana Window object: ${window?.solana}`}
//             <p></p>
//             <button
//               onClick={async () => {
//                 // @ts-ignore
//                 const response = await window?.solana.connect()
//                 console.log(response)
//               }}
//             >
//               Click to Connect Phantom
//             </button>
//           </>
//         }
//       />
//       <Route path="/*" element={<PhandomDLPlayground />} />
//     </Routes>
//   )
// }

export default App;
