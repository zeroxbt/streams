/* eslint-disable no-console */

import { createLibp2p } from './libp2p.js'
import { readData, sendData } from './stream.js'
import { createFromJSON } from '@libp2p/peer-id-factory'
import peerIdListenerJson from './peer-id-listener.js'

const sleep = (millis) => {
  return new Promise((resolve) => setTimeout(resolve, millis));
};

async function run () {
  // Create a new libp2p node with the given multi-address
  const idListener = await createFromJSON(peerIdListenerJson)
  const nodeListener = await createLibp2p({
    peerId: idListener,
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/10333']
    }
  })

  // Log a message when a remote peer connects to us
  nodeListener.connectionManager.addEventListener('peer:connect', (evt) => {
    const connection = evt.detail
    console.log('connected to: ', connection.remotePeer.toString())
  })

  // Handle messages for the protocol
  await nodeListener.handle('/chat/1.0.0', async ({ stream }) => {
    const data = await readData(stream);
    if(data === "header") {
       sendData(stream, "header OK");
      const response = await readData(stream);
      
      if(response === "publish dataset"){
        sendData(stream, "publish OK");
      }
    }
  })

  // Start listening
  await nodeListener.start()
}

run()
