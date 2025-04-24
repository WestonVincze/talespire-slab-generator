import { DecodedSlab } from "../types";
import { encodeSlabToBinary } from "../encode";
import { test_rooms } from "../data/rooms/testRoom";
import { assets } from "../data/assets/defaults";

// experimenting...
async function main() {
  try {
    const slab: DecodedSlab = {
      layouts: [],
      assets: {},
      creatureCount: 0
    }
    // initialize assets
    let floor_count = 0;
    let wall_2x1_count = 0;
    let wall_corner_2x2_count = 0;
    let stairs_count = 0;
    slab.assets[assets.floor.id] = [];
    slab.assets[assets.wall_2x1.id] = [];
    slab.assets[assets.wall_corner_2x2.id] = [];
    slab.assets[assets.stairs.id] = [];

    for (const room of test_rooms) {
      for (let dx = 0; dx < room.width; dx++) {
        for (let dy = 0; dy < room.length; dy++) {
          const scaledX = (room.offset.x + dx) * 200;
          const scaledZ = (room.offset.z + dy) * 200;
          const scaledY = 0;

          slab.assets[assets.floor.id].push({
            scaledX,
            scaledY,
            scaledZ,
            rotation: 0,
          });
          floor_count++;
        }
      }
    }

    slab.layouts.push({
      assetKindId: assets.floor.id,
      assetCount: floor_count
    })

    const slab_string = encodeSlabToBinary(slab);
    console.log(slab_string);
  } catch (e) {
    console.error(`Error parsing slab from dungeon data: ${(e as Error).message}`)
  }
}

main().catch(console.error);
