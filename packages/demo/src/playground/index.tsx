import Box from '@mui/material/Box'
import React from 'react'
import { createAppUrl } from "./routing";
import {
  Route,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { QRCodeCanvas } from "qrcode.react";

const kp = new Keypair();



export const PhandomDLPlayground: React.FC = () => {
  const location = useLocation();
  const { method } = useParams();
  let [searchParams, setSearchParams] = useSearchParams();
  const [log, setLog] = React.useState<string[]>([]);
  const [transactionURL, setTransactionURL] = React.useState<string>();

  
  React.useEffect(()=>{


  }, [location])


  const connection = React.useMemo(() => {
    const network = clusterApiUrl("devnet");

    return new Connection(network);
  }, []);


  React.useEffect(() => {
    if (method === "connect") {
      let a: string[] = [];

      searchParams.forEach((value, key) => {
        a.push(`${key} => ${value}`);
      });

      setLog(a);

      console.log(searchParams);
      console.log(JSON.stringify(searchParams));

      if (
        searchParams.has("data") &&
        searchParams.has("nonce") &&
        searchParams.has("phantom_encryption_public_key")
      ) {
        // solana.connectDLHandler(
        //   searchParams.get("data")!,
        //   searchParams.get("nonce")!,
        //   searchParams.get("phantom_encryption_public_key")!
        // );
      }
      
    }
  }, [location.search, method, searchParams]);

  return (
    <Box borderRadius="15px" border="2px solid grey">
      PhantomDLPLayground ({process.env.REACT_APP_IP})
      
      <p>{location.search}</p>
      <p style={{ overflowWrap: "break-word" }}>
        {" "}
        {JSON.stringify(log, null, 2)}
      </p>
      <p>key</p>
      <pre>
      </pre>
      <br />
      {transactionURL && (
        <>
          <br />
          <br />
          <br />
          <br />
          <br />
          <a href={transactionURL}>transactionURL:{transactionURL}</a>
          <br />
          {transactionURL && <QRCodeCanvas value={transactionURL} />}
        </>
      )}
    </Box>
  );
};

export default PhandomDLPlayground;
