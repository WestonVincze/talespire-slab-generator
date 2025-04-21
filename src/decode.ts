import { BITS_PER_COMPONENT, ENCODED_POSITION_MAX_VALUE, ROT_MASK, ROTATION_BITS_OFFSET, UNUSED_BITS_OFFSET, Y_BITS_OFFSET, Z_BITS_OFFSET } from './constants';
import { decodeUUID } from './helpers';
import { AssetData, DecodedSlab } from './types';
import { gunzipSync } from 'zlib';

export function decodeAsset(encoded: bigint): AssetData {
  const x = Number(encoded & BigInt((1 << BITS_PER_COMPONENT) - 1));
  const y = Number((encoded >> BigInt(Y_BITS_OFFSET)) & BigInt((1 << BITS_PER_COMPONENT) - 1));
  const z = Number((encoded >> BigInt(Z_BITS_OFFSET)) & BigInt((1 << BITS_PER_COMPONENT) - 1));
  const rot = Number((encoded >> BigInt(ROTATION_BITS_OFFSET)));

  return {
    scaledX: x,// / 100,
    scaledY: y,// / 100,
    scaledZ: z,// / 100,
    rotation: rot * (360 / 24),
  };
}

export function decodeSlab(base64: string): DecodedSlab {
  try {
    // Step 1: Preprocess the input string
    let trimmed = base64.trim();
    if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
      trimmed = trimmed.slice(3, -3);
    }
    const buffer = Buffer.from(trimmed, 'base64');
    let offset = 0;

    // Step 2: Decompress the data
    const decompressed = gunzipSync(buffer);

    // Step 3: Read and validate the header
    const header = decompressed.readUInt32LE(offset);
    offset += 4;
    if (header !== 0xD1CEFACE) {
      throw new Error('Invalid slab header: Expected 0xD1CEFACE');
    }

    const version = decompressed.readUInt16LE(offset);
    offset += 2;
    if (version !== 2) {
      throw new Error(`Unsupported slab version: ${version}`);
    }

    // Step 4: Read counts
    const layoutCount = decompressed.readUInt16LE(offset);
    offset += 2;
    const creatureCount = decompressed.readUInt16LE(offset); // Always 0 in version 2
    offset += 2;

    // Step 5: Parse layouts
    const layouts: { assetKindId: string; assetCount: number }[] = [];
    for (let i = 0; i < layoutCount; i++) {
      const assetKindIdBuffer = decompressed.subarray(offset, offset + 16);
      const assetKindId = decodeUUID(assetKindIdBuffer);
      const assetCount = decompressed.readUInt16LE(offset + 16);
      layouts.push({ assetKindId, assetCount });
      offset += 20; // Each layout is 20 bytes
    }

    // Step 6: Parse assets
    const assetIds = new Set<string>();
    const assets: Record<string, AssetData[]> = {}
    for (const layout of layouts) {
      assets[layout.assetKindId] = [];
      for (let i = 0; i < layout.assetCount; i++) {
        const encodedAsset = decompressed.readBigUInt64LE(offset);
        const decodedAsset = decodeAsset(encodedAsset);
        assets[layout.assetKindId].push(decodedAsset);

        offset += 8;
      }
    }

    return {
      layouts,
      assets,
      creatureCount: 0
    };
  } catch (err) {
    throw new Error('Failed to decode slab: ' + (err as Error).message);
  }
}
