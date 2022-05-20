import React from 'react'
import { usePhantomRedirectAdapter, PhantomRedirectAdapter } from 'phantom-deeplink-utils'
import './App.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import WalletContext from './context/Wallet'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useLocation } from 'react-router-dom'
import { Connection, clusterApiUrl, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { decryptPayload, encryptPayload } from 'phantom-deeplink-utils/lib/utils'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { createAppUrl } from './playground/routing';
import { getConnectURL } from '../../library/src/methods/connect';

const NETWORK = clusterApiUrl("mainnet-beta");
const onConnectRedirectLink = createAppUrl("onConnect");
const onDisconnectRedirectLink = createAppUrl("onDisconnect");
const onSignAndSendTransactionRedirectLink = createAppUrl("onSignAndSendTransaction");
const onSignAllTransactionsRedirectLink = createAppUrl("onSignAllTransactions");
const onSignTransactionRedirectLink = createAppUrl("onSignTransaction");
const onSignMessageRedirectLink = createAppUrl("onSignMessage");

declare global {
  interface WindowSolana extends Window {
    solana?: PhantomRedirectAdapter
  }
}
declare const window: WindowSolana

const App: React.FC = () => {
  return (
    <WalletContext>
      <Page />
    </WalletContext>
  )
}

const Page: React.FC = () => {
  const solana = usePhantomRedirectAdapter({ appUrl: window.location.host })
  console.log('solana object from window: ', window?.solana)

  return (
    <div>
      {`Solana Window object, is Phantom: ${window?.solana?.isPhantom}`} <br />
      {`Solana Window object, is Redirect: ${window?.solana?.isRedirectFlow || false}`}
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
              const response = await window?.solana.connect()
              console.log(response)
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
  )
}

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

export default App
