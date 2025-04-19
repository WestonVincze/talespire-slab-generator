import fs from 'fs';
import path from 'path';
import { DungeonData } from './types';

const inputPath = path.join(process.cwd(), 'input/dungeon.json');
const raw = fs.readFileSync(inputPath, 'utf-8');
const data: DungeonData = JSON.parse(raw);


console.log('TaleSpire Slab String:');
