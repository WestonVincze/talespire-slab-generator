import { default_assets } from "../data/assets/defaults";
import type { Assets, DecodedSlab, Layout, Region } from "../types";

const rotations = {
  "top-left": 0,
  "top-right": 0,
  "bottom-left": 0,
  "bottom-right": 0,
}

/**
 * Generates slab data using provided regions
 * @param regions an array of Regions
 * @returns a decoded slab, ready to be encoded for TaleSpire
 */
export function generateSlab(regions: Region[]): DecodedSlab {
  const assets: Assets = {
    [default_assets.floor.id]: [],
    [default_assets.wall_2x1.id]: [],
    [default_assets.wall_corner_2x2.id]: [],
    [default_assets.stairs.id]: [],
  };

  for (const region of regions) {
    if (region.type === "connection") {
      const scaledX = region.offset.x * 200;
      const scaledZ = region.offset.z * 200;
      const scaledY = 0;

      assets[default_assets.floor.id].push({
        scaledX,
        scaledY,
        scaledZ,
        rotation: 0,
      });

      switch (region.door?.direction) {
        case "left":
        case "right":
          assets[default_assets.wall_2x1.id].push({
            scaledX,
            scaledY,
            scaledZ,
            rotation: 0,
          });
          assets[default_assets.wall_2x1.id].push({
            scaledX,
            scaledY,
            scaledZ: scaledZ + region.length * 200,
            rotation: 0,
          });
          break;
        case "top":
        case "bottom":
          assets[default_assets.wall_2x1.id].push({
            scaledX,
            scaledY,
            scaledZ,
            rotation: 90,
          });
          assets[default_assets.wall_2x1.id].push({
            scaledX: scaledX + region.width * 200,
            scaledY,
            scaledZ,
            rotation: 90,
          });
          break;
      }
    }

    for (let dx = 0; dx < region.width; dx++) {
      for (let dy = 0; dy < region.length; dy++) {
        // for each position, we add the x and z offsets to ensure non-zero values
        const scaledX = (region.offset.x + dx) * 200;
        const scaledZ = (region.offset.z + dy) * 200;
        const scaledY = 0;

        // add floor tile
        assets[default_assets.floor.id].push({
          scaledX,
          scaledY,
          scaledZ,
          rotation: 0,
        });

        if (region.type === "entrance") {
          // entrance
          assets[default_assets.stairs.id].push({
            scaledX: scaledX + 50, // note: stairs can be placed off grid and "centered" if desired
            scaledY: 25,
            scaledZ,
            rotation: 180,
          });
          assets[default_assets.stairs.id].push({
            scaledX: scaledX + 50,
            scaledY: 25,
            scaledZ: scaledZ + 100,
            rotation: 180,
          });
        } else if (region.width === 1 && region.length === 1) {

        } else if (dx === 0 && dy === 0) {
          // bottom left tile 
          assets[default_assets.wall_corner_2x2.id].push({
            scaledX,
            scaledY: 25,
            scaledZ,
            rotation: 0,
          });
        } else if (dx === region.width - 1 && dy === 0) {
          // bottom right tile
          assets[default_assets.wall_corner_2x2.id].push({
            scaledX,
            scaledY: 25,
            scaledZ,
            rotation: 270,
          });
        } else if (dx === 0 && dy === region.length - 1) {
          // top left tile 
          assets[default_assets.wall_corner_2x2.id].push({
            scaledX,
            scaledY: 25,
            scaledZ,
            rotation: 90,
          });
        } else if (dx === region.width - 1 && dy === region.length - 1) {
          // top right tile 
          assets[default_assets.wall_corner_2x2.id].push({
            scaledX,
            scaledY: 25,
            scaledZ,
            rotation: 180,
          });
        } else if (dy === region.length - 1) {
          // top tile
          assets[default_assets.wall_2x1.id].push({
            scaledX,
            scaledY: 25,
            scaledZ: scaledZ + 150,
            rotation: 0
          })
        } else if (dy === 0) {
          // bottom tile
          assets[default_assets.wall_2x1.id].push({
            scaledX,
            scaledY: 25,
            scaledZ,
            rotation: 0
          })
        } else if (dx === 0) {
          // left tile
          assets[default_assets.wall_2x1.id].push({
            scaledX,
            scaledY: 25,
            scaledZ,
            rotation: 90 
          })
        } else if (dx === region.width - 1) {
          // right tile
          assets[default_assets.wall_2x1.id].push({
            scaledX: scaledX + 150,
            scaledY: 25,
            scaledZ,
            rotation: 90
          })
        }
      }
    }
  }

  // create layouts from assets
  const layouts: Layout[] = []

  for (const [id, asset] of Object.entries(assets)) {
    layouts.push({
      assetKindId: id,
      assetCount: asset.length,
    })
  }

  return {
    layouts,
    assets,
    creatureCount: 0
  };

}
