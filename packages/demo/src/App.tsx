import React from 'react'
import { usePhantomRedirectProvider } from 'phantom-deeplink-utils'
import './App.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import WalletContext from './context/Wallet'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

// Hack -- remove this, declare it in the library instead
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean
      isRedirectFlow?: boolean
    }
  }
}

const App: React.FC = () => {
  // eslint-disable-next-line no-restricted-globals
  const solana = usePhantomRedirectProvider({ host: location.host })
  console.log('solana object from in Context: ', solana)

  return (
    <WalletContext>
      <Page />
    </WalletContext>
  )
}

const Page: React.FC = () => {
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
