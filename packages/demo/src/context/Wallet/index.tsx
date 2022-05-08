import React, { FC, useMemo, ReactNode } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter
} from '@solana/wallet-adapter-wallets'
import { PhantomRedirectAdapter } from 'phantom-deeplink-utils'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { ConnectionConfig, clusterApiUrl } from '@solana/web3.js'

declare global {
  interface WindowSolana extends Window {
    solana?: PhantomRedirectAdapter
  }
}
declare const window: WindowSolana

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css')

const WalletContext: FC<{ children: ReactNode }> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  // const network = WalletAdapterNetwork.Devnet
  const network = WalletAdapterNetwork.Devnet

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const connectionConfig = { commitment: 'confirmed' } as ConnectionConfig

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      window?.solana?.isPhantom ? new PhantomWalletAdapter() : new PhantomRedirectAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network })
    ],
    [network]
  )

  return (
    <ConnectionProvider config={connectionConfig} endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div>Network being used: {network.valueOf()} </div>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default WalletContext
