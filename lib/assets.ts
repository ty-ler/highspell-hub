import fs from 'fs';
import path from 'path';

export interface ClientAssetsDataResponse {
	code: number;
	data: ClientAssetsData;
}

export interface ClientAssetsData {
	latestClientVersion: number;
	latestServerVersion: number;
	files: ClientAssetFiles;
}

export interface ClientAssetFiles {
	defs: Defs;
	gameAssets: GameAssets;
}

export interface Defs {
	itemDefs: string;
	worldEntityDefs: string;
	worldEntities: string;
	npcEntityDefs: string;
	npcEntities: string;
	instancedNpcEntities: string;
	shopDefs: string;
	conversationDefs: string;
	groundItems: string;
	spellDefs: string;
	npcLoot: string;
	quests: string;
}

export interface GameAssets {
	earthOverworldMap: string;
	earthUndergroundMap: string;
	moonMap: string;
	earthSkyMap: string;
	earthOverworldPath: string;
	earthUndergroundPath: string;
	moonPath: string;
	earthSkyPath: string;
	appearance: string;
	heightmaps: string;
	items: string;
	meshes: string;
	textures: string;
	creatures: string;
	earthOverworldMinimap: string;
	earthUndergroundMinimap: string;
	earthSkyMinimap: string;
	moonMinimap: string;
}

export type ClientCacheVersion = number | 'current';

export const staticCachesDirPath = path.join(fs.realpathSync('.'), 'static', 'client-caches');

export const cacheDirPath = path.join(fs.realpathSync('.'), 'cache');

export const currentCacheDirPath = path.join(
	fs.realpathSync('.'),
	'src',
	'lib',
	'cache',
	'current'
);

/**
 * Get path of the provided client cache version directory.
 *
 * @param version client cache version
 * @returns path of client cache directory
 */
export const getCacheVersionDirPath = (version: ClientCacheVersion) =>
	path.join(cacheDirPath, version.toString());

/**
 * Get path of the provided client cache version file.
 *
 * @param version client cache version
 * @returns path of cache version file
 */
export const getCacheVersionFilePath = (version: ClientCacheVersion) =>
	path.join(getCacheVersionDirPath(version), '__version.json');

/**
 * Check whether a directory exists for the provided client cache version.
 *
 * @param version client cache version
 * @returns whether directory path exists
 */
export const cacheVersionDirPathExists = (version: ClientCacheVersion) =>
	fs.existsSync(getCacheVersionDirPath(version));

/**
 * Create a directory for the provided client cache version. Will not create directory if it
 * already exists.
 *
 * @param version client cache version
 * @returns whether path was created
 */
export const createCacheVersionDir = (version: ClientCacheVersion) => {
	if (cacheVersionDirPathExists(version)) return false;

	fs.mkdirSync(getCacheVersionDirPath(version), { recursive: true });
	return true;
};

export const ensureCacheVersionDirExists = (version: ClientCacheVersion) => {
	if (!cacheVersionDirPathExists(version)) createCacheVersionDir(version);
};

/**
 * Get the value stored in version file of the provided client cache version.
 */
export const getCacheAssetsVersion = (version: ClientCacheVersion) => {
	const versionFilePath = getCacheVersionFilePath(version);
	if (!fs.existsSync(versionFilePath)) return -1;

	const contents = fs.readFileSync(versionFilePath, 'utf-8');
	const json: { version: number } = JSON.parse(contents);

	return json.version;
};

export const itemNameToFileName = (itemName: string, extension: string) => {
	itemName = itemName.toLowerCase();
	const split = itemName.split(' ');
	itemName = split.join('_');
	itemName = `${itemName}${extension}`;

	return itemName;
};
