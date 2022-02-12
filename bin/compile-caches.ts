import fs from 'fs';
import path from 'path';
import {
	cacheDirPath,
	ClientCacheVersion,
	ensureDirExists,
	getCacheVersionDirPath,
	itemNameToFileName,
	writeJsonToFile
} from '../lib';
import type { ItemDef } from 'src/interfaces/item-defs';
import sharp from 'sharp';
import type { GroundItem } from 'src/interfaces/ground-items';

const EXTRACT_ITEM_IMAGES: boolean = false;

const compileItemDefIcons = async (
	cacheVersionDirPath: string,
	itemDefs: ItemDef[],
	compiledItemDefsPath: string
) => {
	const compiledCacheDirPath = path.join(cacheVersionDirPath, 'compiled');

	const spriteSize = 48;
	const itemsSpriteSheetPath = path.join(cacheVersionDirPath, 'gameAssets', 'items', 'items.png');
	const compiledItemImagesPath = path.join(compiledCacheDirPath, 'itemImages');

	const spriteSheetMetadata = await sharp(itemsSpriteSheetPath).metadata();
	const { width, height } = spriteSheetMetadata;

	const spritesPerRow = Math.max(width, height) / spriteSize;

	ensureDirExists(compiledItemDefsPath);
	if (EXTRACT_ITEM_IMAGES) ensureDirExists(compiledItemImagesPath);

	let row = -1;

	await Promise.all(
		itemDefs.map(async (def, idx) => {
			const left = (idx % spritesPerRow) * spriteSize;
			if (left === 0) row++;
			const top = row * spriteSize;

			const extraction = sharp(itemsSpriteSheetPath).extract({
				width: spriteSize,
				height: spriteSize,
				left,
				top
			});

			if (EXTRACT_ITEM_IMAGES) {
				const spriteFilename = itemNameToFileName(def.name, '.png');
				await extraction.clone().toFile(path.join(compiledItemImagesPath, spriteFilename));
			}

			const buffer = await extraction.clone().toBuffer();
			const base64 = `data:image/png;base64,${buffer.toString('base64')}`;

			def.icon = base64;
		})
	);
};

const compileItemDefGroudItemInstances = (cacheVersionDirPath: string, itemDefs: ItemDef[]) => {
	const groundItemDefsPath = path.join(cacheVersionDirPath, 'defs', 'groundItems.json');
	const _groundItems = fs.readFileSync(groundItemDefsPath, 'utf-8');
	const groundItems = JSON.parse(_groundItems) as GroundItem[];

	const map = new Map<number, GroundItem[]>();

	groundItems.map((groundItem) => {
		let mapGroundItems = map.get(groundItem.itemId);
		if (!mapGroundItems) {
			mapGroundItems = [];
			map.set(groundItem.itemId, mapGroundItems);
		}

		mapGroundItems.push(groundItem);
	});

	map.forEach((groundItems, itemId) => {
		const itemDef = itemDefs.find((def) => def._id === itemId);
		if (itemDef) itemDef.groundItems = groundItems;
	});
};

const compileItemDefs = async (cacheVersionDirPath: string) => {
	const compiledCacheDirPath = path.join(cacheVersionDirPath, 'compiled');

	const _itemDefs = fs.readFileSync(
		path.join(cacheVersionDirPath, 'defs', 'itemDefs.json'),
		'utf-8'
	);
	const itemDefs: ItemDef[] = JSON.parse(_itemDefs);
	const compiledItemDefsPath = path.join(compiledCacheDirPath, 'itemDefs');

	await compileItemDefIcons(cacheVersionDirPath, itemDefs, compiledItemDefsPath);
	compileItemDefGroudItemInstances(cacheVersionDirPath, itemDefs);

	const defFilename = 'itemDefs.json';
	writeJsonToFile(compiledItemDefsPath, defFilename, itemDefs);
};

console.clear();
const cachesVersions = fs
	.readdirSync(cacheDirPath)
	.filter((dir) => !dir.startsWith('.')) as ClientCacheVersion[];
await Promise.all(
	cachesVersions.map(async (version) => {
		const cacheVersionDirPath = getCacheVersionDirPath(version);

		await compileItemDefs(cacheVersionDirPath);
	})
);
