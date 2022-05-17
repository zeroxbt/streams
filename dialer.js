/* eslint-disable no-console */

import { Multiaddr } from "@multiformats/multiaddr";
import { createLibp2p } from "./libp2p.js";
import { readData, sendData } from "./stream.js";
import { createFromJSON } from "@libp2p/peer-id-factory";
import peerIdDialerJson from "./peer-id-dialer.js";
import peerIdListenerJson from "./peer-id-listener.js";

const sleep = (millis) => {
  return new Promise((resolve) => setTimeout(resolve, millis));
};

async function run() {
  const [idDialer, idListener] = await Promise.all([
    createFromJSON(peerIdDialerJson),
    createFromJSON(peerIdListenerJson),
  ]);

  // Create a new libp2p node on localhost with a randomly chosen port
  const nodeDialer = await createLibp2p({
    peerId: idDialer,
    addresses: {
      listen: ["/ip4/0.0.0.0/tcp/0"],
    },
  });

  // Start the libp2p host
  await nodeDialer.start();

  // Dial to the remote peer (the "listener")
  const listenerMa = new Multiaddr(
    `/ip4/127.0.0.1/tcp/10333/p2p/${idListener.toString()}`
  );
  const { stream } = await nodeDialer.dialProtocol(listenerMa, "/chat/1.0.0");

  // Send stdin to the stream
  sendData(stream, "header");
  let response = await readData(stream);

  if (response === "header OK") {
    sendData(stream, "publish dataset");
  }

  response = await readData(stream);

  if (response === "publish OK") {
    console.log("publish completed");
  }
}

run();
