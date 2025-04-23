import { promises as fs } from "fs";
import { convertDungeonDataToAssets } from "../convert";
import { DungeonData } from "../types";
import { encodeSlabToBinary } from "../encode";


async function main() {
  try {
    const dungeonData = await fs.readFile(`input/stormscar_basilica.json`, 'utf-8');

    const dungeonDataJSON: DungeonData = JSON.parse(dungeonData);

    const slabData = convertDungeonDataToAssets(dungeonDataJSON);
    // console.dir(JSON.stringify(slabData));
    const slab = encodeSlabToBinary(slabData);
    console.log(slab);
  } catch (e) {
    console.error(`Error parsing slab from dungeon data: ${(e as Error).message}`)
  }
}

main().catch(console.error);
