import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import _itemDefs from '../static/client-assets/defs/itemDefs.json';
import { clientAssetsPath, ensureDirExists, itemNameToFileName } from '../lib';
import type { ItemDef } from 'src/models/item-defs';

const itemDefs = _itemDefs as ItemDef[];
const spriteSize = 48;
const itemsSpriteSheetPath = path.join(clientAssetsPath, 'gameAssets', 'items', 'items.png');
const itemDefsPath = path.join(clientAssetsPath, 'item-defs');
const itemImagesPath = path.join(clientAssetsPath, 'item-images');

const spriteSheetMetadata = await sharp(itemsSpriteSheetPath).metadata();
const { width, height } = spriteSheetMetadata;

const spritesPerRow = Math.max(width, height) / spriteSize;

ensureDirExists(itemDefsPath);
ensureDirExists(itemImagesPath);

let row = -1;

const newItemDefs = [];
await Promise.all(
	itemDefs.map(async (def, idx) => {
		const left = (idx % spritesPerRow) * spriteSize;
		if (left === 0) row++;
		const top = row * spriteSize;

		const spriteFilename = itemNameToFileName(def.name, '.png');
		const extraction = sharp(itemsSpriteSheetPath).extract({
			width: spriteSize,
			height: spriteSize,
			left,
			top
		});

		await extraction.clone().toFile(path.join(itemImagesPath, spriteFilename));

		const buffer = await extraction.clone().toBuffer();
		const base64 = `data:image/png;base64,${buffer.toString('base64')}`;

		newItemDefs.push({
			...def,
			icon: base64
		});

		const defFilename = 'item-defs.json';
		const defFilepath = path.join(itemDefsPath, defFilename);

		fs.writeFileSync(defFilepath, JSON.stringify(newItemDefs, null, 2));
	})
);
