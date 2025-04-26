import { DungeonData, DungeonDoor, DungeonRect, Region, Vector2 } from './types';

/**
 * Converts DungeonData to Regions
 * @param dungeonData The DungeonData to convert.
 * @returns an array of regions with cleaned data
 */
export function convertDungeonDataToRegions(dungeonData: DungeonData): Region[] {
  // reverse y values (positive y is "up" in TaleSpire, but "down" with generator) and change offsets y value to represent "bottom-left" instead of "top-left"
  const rects = dungeonData.rects.map(r => ({ ...r, y: (r.y * -1) - r.h }));
  const doors = dungeonData.doors.map(d => ({ ...d, y: (d.y * -1) - 1 }));

  // slabs cannot contain negative values, so we can find the lowest x and y values and offset all data to shift to positive values
  const xOffset = Math.abs(rects.reduce((prev, curr) => curr.x < prev ? curr.x : prev, 0));
  // dungeonData is 2d, therefore it's "y" values are actually "z" and all y values are 0
  const zOffset = Math.abs(rects.reduce((prev, curr) => curr.y < prev ? curr.y : prev, 0));

  const regions: Region[] = rects.map((r, i) => ({
    id: i.toString(),
    type: getRoomType(r), //r.x === 0 && r.y === r.h ? "entrance" : "room",
    offset: {
      x: r.x + xOffset,
      z: r.y + zOffset,
      y: 0
    },
    door: getDoor(r, doors),
    length: r.h,
    width: r.w,
  }));

  /**
   * for each door, figure out which rooms it connects...
   * for each room we'll need to know where it's neighbor is and avoid building a wall
   * * look for 1x1 rooms offset by 1 in each axis
   */
  for (const door of dungeonData.doors) {

  }
  
  return regions;
}

const getRoomType = (rect: DungeonRect) => {
  if (rect.x === 0 && rect.y === 0 - rect.h) {
    return "entrance"
  }

  if (rect.h === 1 && rect.w === 1) {
    return "connection"
  }

  return "room";
}

const getDoorType = (type: number) => {
  /**
   * * 0: no doorway (left-right? corner?)
   * * 1: single door
   * * 2: archway of some sort
   * * 3: staircase (entranceway only?)
   * * 4: unused??
   * * 5: double door
   * * 6: secret (direction = side that should be hidden)
   * * 9: staircase
   */
  if (type === 0) return "none";
  if (type === 1) return "single";
  if (type === 2) return "arch";
  if (type === 3) return "staircase-entrance";
  if (type === 5) return "double";
  if (type === 6) return "secret";
  if (type === 7) return "stone"; // "ladder" ?
  if (type === 8) return "staircase-exit"
  if (type === 9) return "staircase";

  return "regular"
}

const getDirection = ({ x, y }: Vector2) => {
  /*
   * * 0,1   = bottom (smaller steps on bottom)
   * * 0,-1  = top (smaller steps on top)
   * * 1,0   = right (smaller steps on right)
   * * -1,0  = left (smaller steps on left)
   */
  if (x === -1) return "left";
  if (x === 1) return "right";
  if (y === -1) return "top";
  if (y === 1) return "bottom";
  return "none";
}

const getDoor = (rect: DungeonRect, doors: DungeonDoor[]) => {
  const door = doors.find(door => door.x === rect.x && door.y === rect.y);

  if (!door) return;

  return ({
    type: getDoorType(door.type),
    direction: getDirection(door.dir),
  })
}

/**
 * Get all neighboring rects (should all be doors) for a rect
 */
const getNeighbors = (rect: DungeonRect, doors: DungeonDoor[]) => {
  const neighbors = [];
  doors.forEach(door => 
    (door.y + 1 === rect.y && door.x >= rect.x && door.x <= rect.w) ||
    (door.y - 1 === rect.y + rect.h && door.x >= rect.x && door.x <= rect.w + rect.x) ||
    (door.x + 1 === rect.x && door.y >= rect.y && door.y <= rect.h + rect.y) ||
    (door.x - 1 === rect.x && door.y >= rect.y && door.y <= rect.h + rect.y)
  )
}
