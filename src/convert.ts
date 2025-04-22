import { assets } from './data/assets/defaults';
import { DungeonData, DecodedSlab } from './types';

/** * * * * * * * *
 *  To Consider   *
 *  * * * * * * * *
 * We could convert dungeon data into a grid cell first, then parse into slab
 * * doing this would create a more extensible solution and make it easier to support alternate data formats
 * * each tile has data (position, child assets with offsets)
 * * grid[y][x] = { ... }
 */

/**
 * Converts DungeonData into an slab string
 * @param dungeonData The DungeonData to convert
 * @returns base64 encoded slab string
 */
export function convertDungeonDataToAssets(dungeonData: DungeonData): DecodedSlab {
  const slab: DecodedSlab = {
    layouts: [],
    assets: {},
    creatureCount: 0
  }

  // initialize floor
  let floor_count = 0;
  slab.assets[assets.floor.id] = [];

  for (const rect of dungeonData.rects) {
    for (let dx = 0; dx < rect.w; dx++) {
      for (let dy = 0; dy < rect.h; dy++) {
        floor_count++;
        const scaledX = (rect.x + dx) * 100;
        const scaledY = (rect.y + dy) * 100;
        const scaledZ = 0;

        // Add the asset to the array
        slab.assets[assets.floor.id].push({
          scaledX,
          scaledY,
          scaledZ,
          rotation: 0,
        });
      }
    }
  }

  slab.layouts.push({
    assetKindId: assets.floor.id,
    assetCount: floor_count
  })

  return slab;
}
