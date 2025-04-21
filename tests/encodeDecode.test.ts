import { encodeAsset, encodeSlabToBinary } from '../src/encode';
import { decodeAsset, decodeSlab } from '../src/decode';
import { DecodedSlab } from '../src/types';
import { gunzipSync, gzipSync } from 'zlib';
import { decodeUUID, encodeUUID } from '../src/helpers';

describe('UUID helpers', () => {
  it('can correctly encode and decode a UUID', () => {
    const uuid = 'fee2bce5-fc53-4eab-bcba-0d7a73e84b49';
    const encoded = encodeUUID(uuid);
    const decoded = decodeUUID(encoded);

    expect(decoded).toBe(uuid)
  })
})

describe('Asset Encoding/Decoding', () => {
  it('should correctly encode and decode an asset', () => {
    const asset = { scaledX: 123, scaledY: 456, scaledZ: 789, rotation: 90 };
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

describe('Slab Encoding/Decoding', () => {
  const sample_slab_string = '```H4sIAAAAAAAACjv369xFJgYmBgYG3ouCltoixv7zX8VaCRw1b2QBij3d8+hf8J/Vfnt28VYVv/D2BImdAOIGngZGEA1kMYJJHgZmBij/BFAFRP4EVP4EVB6sA0gDACTTl9V0AAAA```';
  const sample_slab_data: DecodedSlab = {
    layouts: [
      { assetKindId: '3911d10d-142b-4f33-9fea-5d3a10c53781', assetCount: 4 },
      { assetKindId: 'fee2bce5-fc53-4eab-bcba-0d7a73e84b49', assetCount: 4 },
    ],
    assets: {
      '3911d10d-142b-4f33-9fea-5d3a10c53781': [
        { scaledX: 200, scaledY: 0, scaledZ: 200, rotation: 90 },
        { scaledX: 200, scaledY: 0, scaledZ: 0, rotation: 90 },
        { scaledX: 0, scaledY: 0, scaledZ: 200, rotation: 180 },
        { scaledX: 0, scaledY: 0, scaledZ: 0, rotation: 90 },
      ],
      'fee2bce5-fc53-4eab-bcba-0d7a73e84b49': [
        { scaledX: 200, scaledY: 50, scaledZ: 200, rotation: 90 },
        { scaledX: 200, scaledY: 50, scaledZ: 0, rotation: 90 },
        { scaledX: 0, scaledY: 50, scaledZ: 200, rotation: 180 },
        { scaledX: 0, scaledY: 50, scaledZ: 0, rotation: 180 },
      ],
    },
    creatureCount: 0
  };

  it("should decode sample slab string into slab data identical to sample slab data", () => {
    const decoded = decodeSlab(sample_slab_string);

    for (const layout of decoded.layouts) {
      const assets = decoded.assets[layout.assetKindId]
      for (let i = 0; i < assets.length; i++) {
        expect(assets[i].scaledX).toBeCloseTo(sample_slab_data.assets[layout.assetKindId][i].scaledX, 2);
        expect(assets[i].scaledY).toBeCloseTo(sample_slab_data.assets[layout.assetKindId][i].scaledY, 2);
        expect(assets[i].scaledZ).toBeCloseTo(sample_slab_data.assets[layout.assetKindId][i].scaledZ, 2);
        expect(assets[i].rotation).toBeCloseTo(sample_slab_data.assets[layout.assetKindId][i].rotation, 2);
      }
    }
  })

  it("should encode sample slab data into a slab string identical to sample slab string", () => {
    const encoded = encodeSlabToBinary(sample_slab_data);
    expect(encoded).toBe(sample_slab_string);

    const decoded = decodeSlab(encoded);

    for (const layout of decoded.layouts) {
      const assets = decoded.assets[layout.assetKindId]
      for (let i = 0; i < assets.length; i++) {
        expect(assets[i].scaledX).toBeCloseTo(sample_slab_data.assets[layout.assetKindId][i].scaledX, 2);
        expect(assets[i].scaledY).toBeCloseTo(sample_slab_data.assets[layout.assetKindId][i].scaledY, 2);
        expect(assets[i].scaledZ).toBeCloseTo(sample_slab_data.assets[layout.assetKindId][i].scaledZ, 2);
        expect(assets[i].rotation).toBeCloseTo(sample_slab_data.assets[layout.assetKindId][i].rotation, 2);
      }
    }
  })

  it('should correctly encode slab data and decode identical slab data', () => {
    const slab: DecodedSlab = {
      layouts: [
        { assetKindId: '4ba3517e-5fb2-5c48-b1c0-a937a936e4c2', assetCount: 2 },
        { assetKindId: '329b75a9-d09a-5741-ba8f-7d7e73a1f00c', assetCount: 1 },
      ],
      assets: {
        '4ba3517e-5fb2-5c48-b1c0-a937a936e4c2': [
          { scaledX: 13, scaledY: 456, scaledZ: 789, rotation: 180 },
          { scaledX: 987, scaledY: 654, scaledZ: 321, rotation: 15 },
        ],
        '329b75a9-d09a-5741-ba8f-7d7e73a1f00c': [
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

  it("should correctly decode a slab string and encode an identical slab string", () => {
    const slab = "```H4sIAAAAAAAACjv369xFJgZGBgYGK4+be2ts2fz33xUJT2WJ4eUEik0ASUDpBh4oX5IBBYDEwQAofgLKPAEVP8EAUw8AZEGzMWgAAAA=```";

    const decoded = decodeSlab(slab);
    const encoded = encodeSlabToBinary(decoded);

    const reDecoded = decodeSlab(encoded);

    const reEncoded = encodeSlabToBinary(reDecoded);

    expect(slab).toBe(encoded);

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
