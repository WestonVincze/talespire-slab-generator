import { gzipSync } from "zlib";
import { ENCODED_POSITION_MAX_VALUE, ROT_MASK, ROTATION_BITS_OFFSET, UNUSED_BITS_OFFSET, Y_BITS_OFFSET, Z_BITS_OFFSET } from "./constants";
import { AssetData, DecodedSlab } from "./types";

export function encodeAsset(asset: AssetData): bigint {
  const scaledX = Math.round(asset.scaledX * 100) & ENCODED_POSITION_MAX_VALUE;
  const scaledY = Math.round(asset.scaledY * 100) & ENCODED_POSITION_MAX_VALUE;
  const scaledZ = Math.round(asset.scaledZ * 100) & ENCODED_POSITION_MAX_VALUE;
  const rotation = asset.rotation & ROT_MASK;

  return BigInt(scaledX)
    | (BigInt(scaledY) << BigInt(Y_BITS_OFFSET))
    | (BigInt(scaledZ) << BigInt(Z_BITS_OFFSET))
    | (BigInt(rotation) << BigInt(ROTATION_BITS_OFFSET))
    | (0n << BigInt(UNUSED_BITS_OFFSET));
}

export function encodeSlabToBinary(slab: DecodedSlab): string {
  const header = Buffer.alloc(10);
  header.writeUInt32LE(0xD1CEFACE, 0); // Magic number
  header.writeUInt16LE(2, 4); // Version
  header.writeUInt16LE(slab.layouts.length, 6); // Layout count
  header.writeUInt16LE(0, 8); // Creature count

  const layoutBuffer = Buffer.alloc(slab.layouts.length * 20);

  slab.layouts.forEach((layout, index) => {
    const offset = index * 20;
    const assetKindIdBuffer = Buffer.from(layout.assetKindId.replace(/-/g, ''), 'hex');
    assetKindIdBuffer.copy(layoutBuffer, offset); // UUID
    layoutBuffer.writeUInt16LE(layout.assetCount, offset + 16); // Asset count
    layoutBuffer.writeUInt16LE(0, offset + 18); // Reserved
  });

  // const assetBuffer = Buffer.alloc(slab.assetData.length * 8);
  const assetBuffer = Buffer.alloc(slab.layouts.reduce((sum, layout) => sum + layout.assetCount * 8, 0));

  let assetOffset = 0;

  slab.layouts.forEach((layout) => {
    for (let i = 0; i < layout.assetCount; i++) {
      const assetData = slab.assets[layout.assetKindId];
      if (i >= assetData.length) {
        throw new Error(`Not enough assets in assetData to match layout definitions`);
      }

      const asset = assetData[i];
      const encodedAsset = encodeAsset(asset);
      assetBuffer.writeBigInt64BE(encodedAsset, assetOffset);
      assetOffset += 8;
    }
  });

  const buffer = Buffer.concat([header, layoutBuffer, assetBuffer, Buffer.alloc(2, 0)]);
  const compressedBuffer = gzipSync(buffer);
  return compressedBuffer.toString("base64");
}