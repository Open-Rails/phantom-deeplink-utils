import Box from '@mui/material/Box'
import React from 'react'
// import { initDeepLinking, DeepLinking, ConfigObject } from 'phantom-deeplink-utils'
import { createAppUrl } from './routing'
import { useLocation } from 'react-router-dom'
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  Cluster,
  clusterApiUrl
} from '@solana/web3.js'
import { QRCodeCanvas } from 'qrcode.react'

const kp = new Keypair()

console.log('public:', kp.publicKey.toString())
console.log('private:', kp.secretKey)

// const settingsDL: ConfigObject = {
//   app_url: 'https://openrails.io',
//   dapp_encryption_public_key: 'B9ai1yoP6Axe7rT4tQNS57f5ckN6qW6TEEo4MzkF775p',
//   redirect_link_connect: createAppUrl('connect'),
//   redirect_link_disconnect: createAppUrl('disconnect'),
//   redirect_link_transaction: createAppUrl('transaction')
// }

// const solana = initDeepLinking(new DeepLinking(settingsDL))

// export const PhantomDLPlayground: React.FC = () => {
//   const location = useLocation()
//   const [log, setLog] = React.useState<string[]>([])
//   const [transactionURL, setTransactionURL] = React.useState<string>()
//   const connection = React.useMemo(() => {
//     const network = clusterApiUrl('devnet')

//     return new Connection(network)
//   }, [])

//   React.useEffect(() => {
//     const urlParams = new URLSearchParams(location.search)

//     const data = urlParams.get('data')
//     const nonce = urlParams.get('nonce')
//     const phantom_encryption_public_key = urlParams.get('phantom_encryption_public_key')

//     if (data && nonce && phantom_encryption_public_key && solana) {
//       setLog([data, nonce, phantom_encryption_public_key])

//       solana.connectDLHandler(data, nonce, phantom_encryption_public_key)
//     }
//   }, [location.search])

//   const connurl = solana.connectURL

//   React.useEffect(() => {
//     ;(async () => {
//       const myPubKey = new PublicKey(solana.xkey.publicKey)
//       const transaction = new Transaction()
//       transaction.add(
//         SystemProgram.transfer({
//           fromPubkey: myPubKey,
//           toPubkey: new PublicKey('HwogrHZpHhdWLchRszcPGg1PhEREnvjepMFS2uC6hEr3'),
//           lamports: 0.1 * LAMPORTS_PER_SOL
//         })
//       )
//       transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

//       transaction.feePayer = myPubKey

//       setTransactionURL(solana.signAndSendTransactionURL(transaction))
//     })()
//   }, [connection])
//   console.log('connurl->   ', connurl)

//   const dlTest = createAppUrl('connect?hola=chao&cala=mar')

//   return (
//     <Box borderRadius="15px" border="2px solid grey">
//       PhantomDLPLayground ({process.env.REACT_APP_IP})
//       <pre>{JSON.stringify(settingsDL, null, 1)}</pre>
//       <p>{location.search}</p>
//       <pre> {JSON.stringify(log, null, 1)}</pre>
//       <p>key</p>
//       <pre>
//         {solana.xkey.publicKey.toString()}
//         <br />
//         {solana.xkey.secretKey.toString()}
//       </pre>
//       <br />
//       <a href={connurl}>connurl: {connurl}</a>
//       <br />
//       <QRCodeCanvas value={connurl} />
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <a href={transactionURL}>transactionURL:{transactionURL}</a>
//       <br />
//       {transactionURL && <QRCodeCanvas value={transactionURL} />}
//       <br />
//       <a href={dlTest}>self link test</a>
//       end
//     </Box>
//   )
// }

// export default PhantomDLPlayground
