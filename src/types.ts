export type Vector2 = { x: number, y: number };
export type Vector3 = { x: number, y: number, z: number };

export type DungeonRect = {
  x: number,
  y: number,
  w: number,
  h: number,
  ending?: boolean,
  rotunda?: boolean
}

export type DungeonDoor = {
  x: number,
  y: number,
  dir: Vector2,
  type: number
}

export interface DungeonData {
  rects: DungeonRect[];
  doors: DungeonDoor[];
  notes?: any[];
  columns?: Vector2[];
  water?: Vector2[];
}

export interface Layout {
  assetKindId: string; // UUID as a string
  assetCount: number;
}

/**
  most significant bits -- least significant bits
  | 5 bits | 5 bits | 18 bits | 18 bits | 18 bits |
  | unused |   rot  | scaledZ | scaledY | scaledX |
 */
export interface AssetData {
  scaledX: number; // Scaled position X (divided by 100 to get actual position)
  scaledY: number; // Scaled position Y
  scaledZ: number; // Scaled position Z
  rotation: number; // Rotation in steps (0-23, multiplied by 15 for degrees)
}

export type Assets = Record<string, AssetData[]>;

export interface DecodedSlab {
  layouts: Layout[];
  assets: Assets;
  creatureCount: number; // always 0
}


export type Region = {
  id: string,
  type: string, // "entrance" | "rotund" | "door" | "basic";
  offset: Vector3, // ideally the bottom left position
  length: number,
  width: number,
  props?: [
    {
      id: string,
      position: Vector3,
      rotation: number
    }
  ],
  door?: {
    type: string,
    // position: Vector2,
    direction?: string
    // neighbors?
  },
  neighbors?: string[],
  connections?: Vector2[],
}
