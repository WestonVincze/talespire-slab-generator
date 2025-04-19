import { DungeonData, AssetData } from './types';

/**
 * Converts DungeonData into an array of AssetData for the floor plan.
 * @param dungeonData The DungeonData to convert.
 * @returns An array of AssetData objects.
 */
export function convertDungeonDataToAssets(dungeonData: DungeonData): AssetData[] {
  const assets: AssetData[] = [];
  const assetId = '840790d51095f74cb017f369448d0d52'; // Single asset ID for the floor plan

  // Iterate over each rectangle in the floor plan
  for (const rect of dungeonData.rects) {
    for (let dx = 0; dx < rect.w; dx++) {
      for (let dy = 0; dy < rect.h; dy++) {
        // Calculate the scaled positions
        const scaledX = (rect.x + dx) * 100;
        const scaledY = (rect.y + dy) * 100;
        const scaledZ = 0; // Floor plan is always at Z = 0

        // Add the asset to the array
        assets.push({
          scaledX,
          scaledY,
          scaledZ,
          rotation: 0, // Default rotation
        });
      }
    }
  }

  return assets;
}