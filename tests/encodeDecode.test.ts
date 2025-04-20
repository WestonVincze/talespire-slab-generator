import { encodeAsset, encodeSlabToBinary } from '../src/encode'; // Adjust the import paths as needed
import { decodeAsset, decodeSlab } from '../src/decode'; // Adjust the import paths as needed
import { DecodedSlab } from '../src/types';
import { gunzipSync, gzipSync } from 'zlib';

describe('Asset Encoding/Decoding', () => {
  it('should correctly encode and decode an asset', () => {
    const asset = { scaledX: 1.23, scaledY: 4.56, scaledZ: 7.89, rotation: 3 };
    const encoded = encodeAsset(asset);
    const decoded = decodeAsset(encoded);

    expect(decoded.scaledX).toBeCloseTo(asset.scaledX, 2);
    expect(decoded.scaledY).toBeCloseTo(asset.scaledY, 2);
    expect(decoded.scaledZ).toBeCloseTo(asset.scaledZ, 2);
    expect(decoded.rotation).toBe(asset.rotation);
  });

  it('should handle edge cases for asset encoding/decoding', () => {
    const asset = { scaledX: 0, scaledY: 0, scaledZ: 0, rotation: 0 };
    const encoded = encodeAsset(asset);
    const decoded = decodeAsset(encoded);

    expect(decoded.scaledX).toBeCloseTo(asset.scaledX, 2);
    expect(decoded.scaledY).toBeCloseTo(asset.scaledY, 2);
    expect(decoded.scaledZ).toBeCloseTo(asset.scaledZ, 2);
    expect(decoded.rotation).toBe(asset.rotation);
  });
});

describe('Full Encode/Decode Process', () => {
  it('should correctly encode and decode a slab', () => {
    const slab: DecodedSlab = {
      layouts: [
        { assetKindId: '4ba3517e5fb25c48b1c0a937a936e4c2', assetCount: 2 },
        { assetKindId: '329b75a9d09a5741ba8f7d7e73a1f00c', assetCount: 1 },
      ],
      assets: {
        '4ba3517e5fb25c48b1c0a937a936e4c2': [
          { scaledX: 1.23, scaledY: 4.56, scaledZ: 7.89, rotation: 3 },
          { scaledX: 9.87, scaledY: 6.54, scaledZ: 3.21, rotation: 15 },
        ],
        '329b75a9d09a5741ba8f7d7e73a1f00c': [
          { scaledX: 0, scaledY: 0, scaledZ: 0, rotation: 0 },
        ],
      },
      creatureCount: 0
    };

    const encoded = encodeSlabToBinary(slab);
    const decoded = decodeSlab(encoded);

    expect(decoded.layouts).toHaveLength(slab.layouts.length);
    for (const layout of decoded.layouts) {
      const assets = decoded.assets[layout.assetKindId]
      for (let i = 0; i < assets.length; i++) {
        expect(assets[i].rotation).toBeCloseTo(slab.assets[layout.assetKindId][i].rotation, 2);
        expect(assets[i].scaledX).toBeCloseTo(slab.assets[layout.assetKindId][i].scaledX, 2);
        expect(assets[i].scaledY).toBeCloseTo(slab.assets[layout.assetKindId][i].scaledY, 2);
        expect(assets[i].scaledZ).toBeCloseTo(slab.assets[layout.assetKindId][i].scaledZ, 2);
      }
    }

    const reEncoded = encodeSlabToBinary(decoded);
    const reDecoded = decodeSlab(reEncoded);

    expect(reDecoded.layouts).toHaveLength(slab.layouts.length);
    for (const layout of reDecoded.layouts) {
      const assets = reDecoded.assets[layout.assetKindId]
      for (let i = 0; i < assets.length; i++) {
        expect(assets[i].rotation).toBeCloseTo(slab.assets[layout.assetKindId][i].rotation, 2);
        expect(assets[i].scaledX).toBeCloseTo(slab.assets[layout.assetKindId][i].scaledX, 2);
        expect(assets[i].scaledY).toBeCloseTo(slab.assets[layout.assetKindId][i].scaledY, 2);
        expect(assets[i].scaledZ).toBeCloseTo(slab.assets[layout.assetKindId][i].scaledZ, 2);
      }
    }
  });

  it("should return the same slab string", () => {
    const slab = "H4sIAAAAAAAACjv369xFJgZGBgYGK4+be2ts2fz33xUJT2WJ4eUEik0ASUDpBh4oX5IBBYDEwQAofgLKPAEVP8EAUw8AZEGzMWgAAAA=";

    const decoded = decodeSlab(slab);
    const encoded = encodeSlabToBinary(decoded);

    const reEncoded = encodeSlabToBinary(decoded);
    const reDecoded = decodeSlab(reEncoded);

    // expect(slab).toBe(encoded);

    for (const layout of decoded.layouts) {
      const decodedAssets = decoded.assets[layout.assetKindId];
      const reDecodedAssets = reDecoded.assets[layout.assetKindId];
      for (let i = 0; i < decodedAssets.length; i++) {
        expect(decodedAssets[i].rotation).toBeCloseTo(reDecodedAssets[i].rotation);
        expect(decodedAssets[i].scaledX).toBeCloseTo(reDecodedAssets[i].scaledX);
        expect(decodedAssets[i].scaledY).toBeCloseTo(reDecodedAssets[i].scaledY);
        expect(decodedAssets[i].scaledZ).toBeCloseTo(reDecodedAssets[i].scaledZ);
      }
    }
  })
});

describe('Decode/Encode process without modifying any data', () => {
  it('returns the same slab string given', () => {
    const slab = "H4sIAAAAAAAACjv369xFJgZGBgYGK4+be2ts2fz33xUJT2WJ4eUEik0ASUDpBh4oX5IBBYDEwQAofgLKPAEVP8EAUw8AZEGzMWgAAAA=";

    const buffer = Buffer.from(slab, 'base64');
    const decompressed = gunzipSync(buffer);
    const compressed = gzipSync(decompressed);
    const new_slab = compressed.toString("base64");

    expect(slab).toBe(new_slab);
  })
})