import fs from 'fs';
import path from 'path';
import {
	cacheDirPath,
	clientAssetsPath,
	ClientCacheVersion,
	ensureDirExists,
	getCacheVersionDirPath,
	itemNameToFileName,
	writeJsonToFile
} from '../lib';
import type { ItemDef } from 'src/models/item-defs';
import sharp from 'sharp';

export const compileItemDefs = async (cacheVersionDirPath: string) => {
	const compiledCacheDirPath = path.join(cacheVersionDirPath, 'compiled');

	const _itemDefs = fs.readFileSync(
		path.join(cacheVersionDirPath, 'defs', 'itemDefs.json'),
		'utf-8'
	);
	const itemDefs: ItemDef[] = JSON.parse(_itemDefs);

	const spriteSize = 48;
	const itemsSpriteSheetPath = path.join(cacheVersionDirPath, 'gameAssets', 'items', 'items.png');
	const itemDefsPath = path.join(compiledCacheDirPath, 'itemDefs');
	const itemImagesPath = path.join(compiledCacheDirPath, 'itemImages');

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

			const defFilename = 'itemDefs.json';
			const defFilepath = path.join(itemDefsPath, defFilename);

			writeJsonToFile(itemDefsPath, defFilename, newItemDefs);
		})
	);
};

console.clear();
const cachesVersions = fs.readdirSync(cacheDirPath) as ClientCacheVersion[];
await Promise.all(
	cachesVersions.map(async (version) => {
		const cacheVersionDirPath = getCacheVersionDirPath(version);

		await compileItemDefs(cacheVersionDirPath);
	})
);
