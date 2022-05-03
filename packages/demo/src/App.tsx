import React from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { usePhantomRedirectProvider } from "phantom-deeplink-utils";
import "./App.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { PhandomDLPlayground } from "./playground";
import { Route, Routes } from "react-router-dom";
import AppRouting from "./playground/routing";
declare global {
  interface Window {
    solana?: Object;
  }
}

const App: React.FC = () => {
  return (
    <Context>
      <Content />
    </Context>
  );
};

const Context: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // eslint-disable-next-line no-restricted-globals
  const solana = usePhantomRedirectProvider({ host: location.host });
  console.log("solana object from in Context: ", solana);
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = React.useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = React.useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content: React.FC = () => {
  return (
    <Routes>
      <Route
        path={AppRouting.ProviderInjection}
        element={
          <>
            <WalletMultiButton />
            {`Solana Window object: ${window?.solana}`}
            <p></p>
            <button
              onClick={async () => {
                // @ts-ignore
                const response = await window?.solana.connect();
                console.log(response);
              }}
            >
              Click to Connect Phantom
            </button>
          </>
        }
      />
      <Route path="/*" element={<PhandomDLPlayground />} />
    </Routes>
  );
};

export default App;
