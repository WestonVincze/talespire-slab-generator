import { promises as fs } from "fs";
import { convertDungeonDataToAssets } from "../convert";
import { DungeonData } from "../types";


async function main() {
  try {
    const dungeonData = await fs.readFile(`input/dungeon.json`, 'utf-8');

    const dungeonDataJSON: DungeonData = JSON.parse(dungeonData);

    const slab = convertDungeonDataToAssets(dungeonDataJSON);
    console.dir(JSON.stringify(slab));
  } catch (e) {
    console.error(`Error parsing slab from dungeon data: ${(e as Error).message}`)
  }
}

main().catch(console.error);
