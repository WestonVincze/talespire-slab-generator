#!/usr/bin/env ts-node

import { gunzipSync, gzipSync } from 'zlib';
import { decodeSlab } from '../decode';
import { encodeSlabToBinary } from '../encode';

const snippet = process.argv[2];

if (!snippet) {
  console.error('❌ Please provide a slab snippet as the first argument.');
  process.exit(1);
}

try {
  const slab = decodeSlab(snippet);

  const new_snippet = encodeSlabToBinary(slab);
  console.log("new snippet: ", new_snippet)
} catch (err) {
  console.error('❌ Failed to decode snippet:');
  console.error((err as Error).message);
  process.exit(1);
}
