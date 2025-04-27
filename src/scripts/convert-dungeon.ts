import { promises as fs } from "fs";
import { convertDungeonDataToRegions } from "../convert";
import { DungeonData } from "../types";
import { encodeSlabToBinary } from "../encode";
import { generateSlab } from "../RegionService/generateSlab";

async function main() {
  try {
    const dungeonData = await fs.readFile(`input/forsaken_mausoleum_of_terror.json`, 'utf-8');

    const dungeonDataJSON: DungeonData = JSON.parse(dungeonData);

    const regions = convertDungeonDataToRegions(dungeonDataJSON);
    const slabData = generateSlab(regions);
    const slab = encodeSlabToBinary(slabData);
    console.log(slab);
  } catch (e) {
    console.error(`Error parsing slab from dungeon data: ${(e as Error).message}`)
  }
}

main().catch(console.error);
