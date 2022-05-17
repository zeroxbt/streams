import { TCP } from '@libp2p/tcp'
import { WebSockets } from '@libp2p/websockets'
import { Mplex } from '@libp2p/mplex'
import { Noise } from '@chainsafe/libp2p-noise'
import defaultsDeep from '@nodeutils/defaults-deep'
import { createLibp2p as create } from 'libp2p'

const sleep = (millis) => {
  return new Promise((resolve) => setTimeout(resolve, millis));
};

export async function createLibp2p(_options) {
  const defaults = {
    transports: [
      new TCP()
    ],
    streamMuxers: [
      new Mplex()
    ],
    connectionEncryption: [
      new Noise()
    ]
  }

  return create(defaultsDeep(_options, defaults))
}
