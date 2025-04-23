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
  let wall_count = 0;
  let wall_corner_2x2_count = 0;
  let stairs_count = 0;
  slab.assets[assets.floor.id] = [];
  slab.assets[assets.wall.id] = [];
  slab.assets[assets.wall_corner_2x2.id] = [];
  slab.assets[assets.stairs.id] = [];

  //dungeonData.rects = dungeonData.rects.map(r => ({ ...r, y: r.y * -1}));


  // issue: 0,0 should be the bottom left but it's the top left

  // for each position we need to mirror the y value
  // slabs cannot contain negative values, so we can find the lowest x and y values and offset all data to shift to positive values
  const xOffset = Math.abs(dungeonData.rects.reduce((prev, curr) => curr.x < prev ? curr.x : prev, 0));
  // dungeonData is 2d, therefore it's "y" values are actually "z" and all y values are 0
  const zOffset = Math.abs(dungeonData.rects.reduce((prev, curr) => curr.y - curr.h < prev ? curr.y - curr.h : prev, 0));
  console.log(zOffset)

  for (const rect of dungeonData.rects) {
    for (let dx = 0; dx < rect.w; dx++) {
      for (let dy = 0; dy < rect.h; dy++) {

        const scaledX = (rect.x + dx + xOffset) * 200;
        const scaledZ = (rect.y + dy + zOffset) * 200;
        const scaledY = 0;

        // add floor tile
        slab.assets[assets.floor.id].push({
          scaledX,
          scaledY,
          scaledZ,
          rotation: 0,
        });
        floor_count++;

        // add walls
        if (rect.x === 0 && rect.y === 0) {
          // entrance
          slab.assets[assets.stairs.id].push({
            scaledX: scaledX + 50,
            scaledY: 25,
            scaledZ,
            rotation: 180,
          });
          stairs_count++;
          slab.assets[assets.stairs.id].push({
            scaledX: scaledX + 50,
            scaledY: 25,
            scaledZ: scaledZ + 100,
            rotation: 180,
          });
          stairs_count++;
        } else if (rect.w === 1 && rect.h === 1) {

        } else if (dx === 0 && dy === 0) {
          // bottom left tile 
          slab.assets[assets.wall_corner_2x2.id].push({
            scaledX,
            scaledY: 25,
            scaledZ,
            rotation: 0,
          });
          wall_corner_2x2_count++;
        } else if (dx === rect.w - 1 && dy === 0) {
          // bottom right tile
          slab.assets[assets.wall_corner_2x2.id].push({
            scaledX,
            scaledY: 25,
            scaledZ,
            rotation: 270,
          });
          wall_corner_2x2_count++;
        } else if (dx === 0 && dy === rect.h - 1) {
          // top left tile 
          slab.assets[assets.wall_corner_2x2.id].push({
            scaledX,
            scaledY: 25,
            scaledZ,
            rotation: 90,
          });
          wall_corner_2x2_count++;
        } else if (dx === rect.w - 1 && dy === rect.h - 1) {
          // top right tile 
          slab.assets[assets.wall_corner_2x2.id].push({
            scaledX,
            scaledY: 25,
            scaledZ,
            rotation: 180,
          });
          wall_corner_2x2_count++;
        } else {
          /*
          slab.assets[assets.wall.id].push({
            scaledX: scaledX + 100,
            scaledY,
            scaledZ,
            rotation: 0
          })

          slab.assets[assets.wall.id].push({
            scaledX: scaledX + 100,
            scaledY,
            scaledZ: scaledZ + 100,
            rotation: 0
          })
          wall_count += 2;
          */
        }
      }
    }
  }

  slab.layouts.push({
    assetKindId: assets.floor.id,
    assetCount: floor_count
  })

  slab.layouts.push({
    assetKindId: assets.wall.id,
    assetCount: wall_count 
  })

  slab.layouts.push({
    assetKindId: assets.wall_corner_2x2.id,
    assetCount: wall_corner_2x2_count 
  })

  slab.layouts.push({
    assetKindId: assets.stairs.id,
    assetCount: stairs_count
  })

  return slab;
}


type tileType = "top-left" | "top";