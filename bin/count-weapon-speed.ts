import fs from 'fs';
import { join } from 'path';
import { getCacheVersionDirPath } from '../lib';
import type { ItemDef } from 'src/interfaces/item-defs';

const cacheVersionDirPath = getCacheVersionDirPath('current');

const itemDefsFilePath = join(cacheVersionDirPath, 'compiled', 'itemDefs', 'itemDefs.json');

const contents = fs.readFileSync(itemDefsFilePath, 'utf-8');
const itemDefs: ItemDef[] = JSON.parse(contents);

const map = new Map<number, string[]>();

itemDefs
	.filter((def) => def.weaponSpeed != null)
	.map((def) => {
		const key = def.weaponSpeed;
		let mapped = map.get(key);
		if (!mapped) {
			mapped = [];
			map.set(key, mapped);
		}

		mapped.push(def.name);
	});

console.log(Array.from(map));
