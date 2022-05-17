/* eslint-disable no-console */

import { pipe } from "it-pipe";
import * as lp from "it-length-prefixed";
import map from "it-map";
import { BufferList } from "bl";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";

export function sendData(stream, data) {
  console.log(`sending data data : ${data}`)
  pipe(
    data,
    // Turn strings into buffers
    (source) => map(source, (string) => uint8ArrayFromString(string)),
    // Encode with length prefix (so receiving side knows how much data is coming)
    lp.encode(),
    // Write to the stream (the sink)
    stream,
  );
}

export async function readData(stream) {
  const data = await pipe(
    // Read from the stream (the source)
    stream.source,
    // Decode length-prefixed data
    lp.decode(),
    // Turn buffers into strings
    (source) => map(source, (buf) => uint8ArrayToString(buf)),
    async function (source) {
      const bl = new BufferList();
      for await (const msg of source) {
        bl.append(msg);
      }
      // console.log(`Receiving data using stream: ${result.toString()}`);
      return bl;
    }
  )
  console.log(`reading data : ${data.toString()}`)

  return data.toString();
}


