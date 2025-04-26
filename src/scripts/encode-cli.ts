import { default_assets } from "../data/assets/defaults";
import { encodeSlabToBinary } from "../encode";
import { DecodedSlab } from "../types";

export const beds: DecodedSlab = {
  layouts: [
    {
      assetKindId: "93e03a25-ed1b-44c4-bddd-31e1fca673c2",
      assetCount: 4
    }
  ],
  assets: {
    "93e03a25-ed1b-44c4-bddd-31e1fca673c2": [
      {
        scaledX: 0, scaledY: 0, scaledZ: 0, rotation: 0
      },
      {
        scaledX: 100, scaledY: 0, scaledZ: 0, rotation: 0
      },
      {
        scaledX: 200, scaledY: 0, scaledZ: 0, rotation: 0
      },
      {
        scaledX: 300, scaledY: 0, scaledZ: 0, rotation: 0
      },
      {
        scaledX: 400, scaledY: 0, scaledZ: 0, rotation: 0
      },
    ]
  },
  creatureCount: 0,
}

const small_tile_test: DecodedSlab = {
  layouts: [
    {
      assetKindId: "bdd9483a-3d7c-4f06-bfdd-145765045c0d",
      assetCount: 4
    }
  ],
  assets: {
    "bdd9483a-3d7c-4f06-bfdd-145765045c0d": [
      {
        scaledX: 0, scaledY: 0, scaledZ: 0, rotation: 0
      },
      {
        scaledX: 200, scaledY: 0, scaledZ: 0, rotation: 0
      },
      {
        scaledX: 400, scaledY: 0, scaledZ: 0, rotation: 0
      },
      {
        scaledX: 0, scaledY: 0, scaledZ: 200, rotation: 0
      },
    ]
  },
  creatureCount: 0
}

const room_with_walls_4x2: DecodedSlab = {
  layouts: [
    {
      assetKindId: default_assets.floor.id,
      assetCount: 2,
    },
    {
      assetKindId: default_assets.wall_2x1.id,
      assetCount: 8,
    },
  ],
  assets: {
    [default_assets.floor.id]: [
      {
        scaledX: 0, scaledY: 12.5, scaledZ: 100, rotation: 0
      },
      {
        scaledX: 200, scaledY: 12.5, scaledZ: 100, rotation: 0
      },
      /*
      {
        scaledX: 400, scaledY: 0, scaledZ: 0, rotation: 0
      },
      {
        scaledX: 600, scaledY: 0, scaledZ: 0, rotation: 0
      },
      {
        scaledX: 0, scaledY: 0, scaledZ: 200, rotation: 0
      },
      {
        scaledX: 200, scaledY: 0, scaledZ: 200, rotation: 0
      },
      {
        scaledX: 400, scaledY: 0, scaledZ: 200, rotation: 0
      },
      {
        scaledX: 600, scaledY: 0, scaledZ: 200, rotation: 0
      },
      */
    ],
    [default_assets.wall_2x1.id]: [
      {
        scaledX: 0, scaledY: 0, scaledZ: 0, rotation: 0
      },
      {
        scaledX: 100, scaledY: 0, scaledZ: 0, rotation: 0
      },
      {
        scaledX: 200, scaledY: 0, scaledZ: 0, rotation: 0
      },
      {
        scaledX: 300, scaledY: 0, scaledZ: 0, rotation: 0
      },
      {
        scaledX: 0, scaledY: 0, scaledZ: 300, rotation: 180
      },
      {
        scaledX: 100, scaledY: 0, scaledZ: 300, rotation: 180
      },
      {
        scaledX: 200, scaledY: 0, scaledZ: 300, rotation: 180 
      },
      {
        scaledX: 300, scaledY: 0, scaledZ: 300, rotation: 180
      },
    ]
  },
  creatureCount: 0,
}

try {
  const snippet = encodeSlabToBinary(room_with_walls_4x2);
  console.log(snippet);
} catch (err) {
  console.error('❌ Failed to encode slab data:');
  console.error((err as Error).message);
  process.exit(1);
}
