import Box from '@mui/material/Box'
import React from 'react'
import {
  connectURL,
  connect,
  initDeepLinking,
  getTypedWindowSolana,
  DeepLinking,
  ConfigObject
} from 'phantom-deeplink-utils'
import { createAppUrl } from './routing'
import { useLocation } from 'react-router-dom'
import { Keypair } from '@solana/web3.js'
import { QRCodeCanvas } from 'qrcode.react'

const kp = new Keypair()

console.log('public:', kp.publicKey.toString())
console.log('private:', kp.secretKey)

const settingsDL: ConfigObject = {
  app_url: 'https://openrails.io',
  dapp_encryption_public_key: 'B9ai1yoP6Axe7rT4tQNS57f5ckN6qW6TEEo4MzkF775p',
  redirect_link_connect: createAppUrl('connect'),
  redirect_link_disconnect: createAppUrl('disconnect')
}

const solana = initDeepLinking(new DeepLinking(settingsDL))

export const PhandomDLPlayground: React.FC = () => {
  const location = useLocation()
  const [log, setLog] = React.useState<string[]>([])

  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search)

    const data = urlParams.get('data')
    const nonce = urlParams.get('nonce')
    const phantom_encryption_public_key = urlParams.get('phantom_encryption_public_key')

    if (data && nonce && phantom_encryption_public_key && solana) {
      setLog([data, nonce, phantom_encryption_public_key])

      solana.connectDLHandler(data, nonce, phantom_encryption_public_key)
    }
  }, [])

  const connurl = solana.connectURL

  console.log('connurl->   ', connurl)

  const dlTest = createAppUrl('connect?hola=chao&cala=mar')

  return (
    <Box borderRadius="15px" border="2px solid grey">
      PhantomDLPLayground
      <pre>{JSON.stringify(settingsDL, null, 1)}</pre>
      <p>{location.search}</p>
      <pre> {JSON.stringify(log, null, 1)}</pre>
      <p>key</p>
      <pre>
        {solana.xkey.publicKey.toString()}
        <br />
        {solana.xkey.secretKey.toString()}
      </pre>
      <a href={connurl}>{connurl}</a>
      <a href={dlTest}>self link test</a>
      <QRCodeCanvas value={connurl} />
      end
    </Box>
  )
}

export default PhandomDLPlayground
