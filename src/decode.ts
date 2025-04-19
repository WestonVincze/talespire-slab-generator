import { BITS_PER_COMPONENT, ROT_MASK, ROTATION_BITS_OFFSET, Y_BITS_OFFSET, Z_BITS_OFFSET } from './constants';
import { AssetData, DecodedSlab } from './types';
import { gunzipSync } from 'zlib';

export function decodeAsset(encoded: bigint): AssetData {
  const scaledX = Number(encoded & BigInt((1 << BITS_PER_COMPONENT) - 1));
  const scaledY = Number((encoded >> BigInt(Y_BITS_OFFSET)) & BigInt((1 << BITS_PER_COMPONENT) - 1));
  const scaledZ = Number((encoded >> BigInt(Z_BITS_OFFSET)) & BigInt((1 << BITS_PER_COMPONENT) - 1));
  const rotation = Number((encoded >> BigInt(ROTATION_BITS_OFFSET)) & BigInt(ROT_MASK));

  return {
    scaledX: scaledX / 100,
    scaledY: scaledY / 100,
    scaledZ: scaledZ / 100,
    rotation,
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

    // Step 2: Decompress the data
    const decompressed = gunzipSync(buffer);

    // Step 3: Read and validate the header
    const header = decompressed.readUInt32LE(0);
    if (header !== 0xD1CEFACE) {
      throw new Error('Invalid slab header: Expected 0xD1CEFACE');
    }

    const version = decompressed.readUInt16LE(4);
    if (version !== 2) {
      throw new Error(`Unsupported slab version: ${version}`);
    }

    // Step 4: Read counts
    const layoutCount = decompressed.readUInt16LE(6);
    const creatureCount = decompressed.readUInt16LE(8); // Always 0 in version 2

    // Step 5: Parse layouts
    const layouts: { assetKindId: string; assetCount: number }[] = [];
    let offset = 10; // Start after header and counts
    for (let i = 0; i < layoutCount; i++) {
      const assetKindId = decompressed.subarray(offset, offset + 16).toString('hex');
      const assetCount = decompressed.readUInt16LE(offset + 16);
      layouts.push({ assetKindId, assetCount });
      offset += 20; // Each layout is 20 bytes
    }

    // Step 6: Parse assets
    const assetIds = new Set<string>();
    // const assetData: Record<string, AssetData[]> = {}
    const assetData: AssetData[] = [];
    for (const layout of layouts) {
      console.log("LAYOUT")
      for (let i = 0; i < layout.assetCount; i++) {
        const assetOffset = offset + i * 8;
        // const assetBuffer = decompressed.subarray(assetOffset, assetOffset + 8);
        const encodedAsset = decompressed.readBigInt64BE(offset);
        const decodedAsset = decodeAsset(encodedAsset);
        assetData.push(decodedAsset);
        
        /*
        const decodedAsset = decodeAsset(assetBuffer.readBigInt64BE());
        console.log(decodedAsset);

        // Add the AssetKindId to the set
        assetIds.add(layout.assetKindId);
        */

        //if (!assetData[layout.assetKindId]) assetData[layout.assetKindId] = [];
        //assetData[layout.assetKindId].push(decodedAsset);
        // assetData.push(decodedAsset);
        offset += 8;
      }
      // offset += layout.assetCount * 8; // Move to the next set of assets
    }

    return {
      layouts,
      assetData,
      creatureCount: 0
    };
  } catch (err) {
    throw new Error('Failed to decode slab: ' + (err as Error).message);
  }
}
