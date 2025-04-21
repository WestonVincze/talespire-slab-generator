import { gzipSync } from "zlib";
import { ENCODED_POSITION_MAX_VALUE, ROT_MASK, ROTATION_BITS_OFFSET, UNUSED_BITS_OFFSET, X_BITS_OFFSET, Y_BITS_OFFSET, Z_BITS_OFFSET } from "./constants";
import { AssetData, DecodedSlab } from "./types";
import { encodeUUID } from "./helpers";

export function encodeAsset(asset: AssetData): bigint {
  const scaledX = asset.scaledX & ENCODED_POSITION_MAX_VALUE;
  const scaledY = asset.scaledY & ENCODED_POSITION_MAX_VALUE;
  const scaledZ = asset.scaledZ & ENCODED_POSITION_MAX_VALUE;
  const rotation = asset.rotation & ROT_MASK;
  const unusedBits = 0n;

  if (scaledX < 0 || scaledY < 0 || scaledZ < 0) {
    throw new Error("Scaled position cannot be negative");
  }
  if (scaledX > ENCODED_POSITION_MAX_VALUE || scaledY > ENCODED_POSITION_MAX_VALUE || scaledZ > ENCODED_POSITION_MAX_VALUE) {
    throw new Error("Scaled position out of bounds");
  }

  // Mask values
  const maskedX = scaledX & ENCODED_POSITION_MAX_VALUE;
  const maskedY = scaledY & ENCODED_POSITION_MAX_VALUE;
  const maskedZ = scaledZ & ENCODED_POSITION_MAX_VALUE;
  const rotMasked = asset.rotation * 15.0 & ROT_MASK;
  const fiveBitsMasked = 0 & 0b11111; // Mask to 5 bits

  // Combine into a single bigint
  return (
    (BigInt(maskedX)) |
    (BigInt(maskedY) << BigInt(Y_BITS_OFFSET)) |
    (BigInt(maskedZ) << BigInt(Z_BITS_OFFSET)) |
    (BigInt(rotMasked) << BigInt(ROTATION_BITS_OFFSET)) |
    (BigInt(0n) << BigInt(UNUSED_BITS_OFFSET))
  );
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
    const assetKindIdBuffer = encodeUUID(layout.assetKindId);
    assetKindIdBuffer.copy(layoutBuffer, offset);
    layoutBuffer.writeUInt16LE(layout.assetCount, offset + 16); // Asset count
    layoutBuffer.writeUInt16LE(0, offset + 18); // Reserved
  });

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
      assetBuffer.writeBigUInt64LE(encodedAsset, assetOffset);
      assetOffset += 8;
    }
  });

  const buffer = Buffer.concat([header, layoutBuffer, assetBuffer, Buffer.alloc(2, 0)]);
  const compressedBuffer = gzipSync(buffer);
  return `\`\`\`${compressedBuffer.toString("base64")}\`\`\``;
}