import React from "react";
import "./App.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
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

const Page: React.FC = () => {
  return (
    <div>
      <div>
        <b>React Methods:</b>
        <div>{<WalletMultiButton />}</div>
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

        {}
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
