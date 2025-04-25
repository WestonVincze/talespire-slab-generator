import { DungeonData, Region } from './types';

/**
 * Converts DungeonData to Regions
 * @param dungeonData The DungeonData to convert.
 * @returns an array of regions with cleaned data
 */
export function convertDungeonDataToRegions(dungeonData: DungeonData): Region[] {
  // reverse y values (positive y is "up" in TaleSpire, but "down" with generator) and change offsets y value to represent "bottom-left" instead of "top-left"
  const rects = dungeonData.rects.map(r => ({ ...r, y: (r.y * -1) - r.h }));

  // slabs cannot contain negative values, so we can find the lowest x and y values and offset all data to shift to positive values
  const xOffset = Math.abs(rects.reduce((prev, curr) => curr.x < prev ? curr.x : prev, 0));
  // dungeonData is 2d, therefore it's "y" values are actually "z" and all y values are 0
  const zOffset = Math.abs(rects.reduce((prev, curr) => curr.y < prev ? curr.y : prev, 0));

  const regions: Region[] = rects.map((r, i) => ({
    id: i.toString(),
    type: r.x === 0 && r.y === r.h ? "entrance" : "room",
    offset: {
      x: r.x + xOffset,
      z: r.y + zOffset,
      y: 0
    },
    length: r.h,
    width: r.w,
  }));
  
  return regions;
}
