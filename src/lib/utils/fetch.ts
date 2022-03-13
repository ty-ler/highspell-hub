import type { ClientCacheVersion } from 'lib';
import type { GroundItem } from 'src/interfaces/game/ground-items';
import type { ItemDef } from 'src/interfaces/game/item-defs';
import type { NpcEntity, NpcEntityDef } from 'src/interfaces/game/npc';
import type { NpcLoot } from 'src/interfaces/game/npc-loot';
import type { Quest } from 'src/interfaces/game/quest';
import type { Shop } from 'src/interfaces/game/shop';
import type { Spell } from 'src/interfaces/game/spell';
import type { WorldEntity, WorldEntityDef } from 'src/interfaces/game/world-entities';

type Fetch = (info: RequestInfo, init?: RequestInit) => Promise<Response>;

const getBaseVersionUrl = (version: ClientCacheVersion, baseUrl: string = '') => {
	return `${baseUrl ?? ''}/client-caches/${version}`;
};

const get = async (
	version: ClientCacheVersion,
	fetch: Fetch,
	baseUrl: string = '',
	endpoint: string
) => {
	const baseVersionUrl = getBaseVersionUrl(version, baseUrl);
	return await (await fetch(`${baseVersionUrl}${endpoint}`)).json();
};

export const fetchItems = async (
	version: ClientCacheVersion,
	fetch: Fetch,
	baseUrl: string = ''
): Promise<ItemDef[]> => {
	return await get(version, fetch, baseUrl, '/compiled/itemDefs/itemDefs.json');
};

export const fetchGroundItems = async (
	version: ClientCacheVersion,
	fetch: Fetch,
	baseUrl: string = ''
): Promise<GroundItem[]> => {
	return await get(version, fetch, baseUrl, '/defs/groundItems.json');
};

export const fetchNpcLoot = async (
	version: ClientCacheVersion,
	fetch: Fetch,
	baseUrl: string = ''
): Promise<NpcLoot> => {
	return await get(version, fetch, baseUrl, '/defs/npcLoot.json');
};

export const fetchQuests = async (
	version: ClientCacheVersion,
	fetch: Fetch,
	baseUrl: string = ''
): Promise<Quest[]> => {
	return await get(version, fetch, baseUrl, '/defs/quests.json');
};

export const fetchShops = async (
	version: ClientCacheVersion,
	fetch: Fetch,
	baseUrl: string = ''
): Promise<Shop[]> => {
	return await get(version, fetch, baseUrl, '/defs/shopDefs.json');
};

export const fetchSpells = async (
	version: ClientCacheVersion,
	fetch: Fetch,
	baseUrl: string = ''
): Promise<Spell[]> => {
	return await get(version, fetch, baseUrl, '/defs/spellDefs.json');
};

export const fetchNpcEntities = async (
	version: ClientCacheVersion,
	fetch: Fetch,
	baseUrl: string = ''
): Promise<NpcEntity[]> => {
	return await get(version, fetch, baseUrl, '/defs/npcEntities.json');
};

export const fetchNpcEntityDefs = async (
	version: ClientCacheVersion,
	fetch: Fetch,
	baseUrl: string = ''
): Promise<NpcEntityDef[]> => {
	return await get(version, fetch, baseUrl, '/defs/npcEntityDefs.json');
};

export const fetchNpcs = async (
	version: ClientCacheVersion,
	fetch: Fetch,
	baseUrl: string = ''
): Promise<
	{
		npc: NpcEntity;
		npcDef: NpcEntityDef;
	}[]
> => {
	const npcs = await fetchNpcEntities(version, fetch, baseUrl);
	const npcDefs = await fetchNpcEntityDefs(version, fetch, baseUrl);

	return npcDefs.map((def) => ({
		npc: npcs.find((n) => n.npcdef_id === def._id),
		npcDef: def
	}));
};

export const fetchWorldEntityInstances = async (
	version: ClientCacheVersion,
	fetch: Fetch,
	baseUrl: string = ''
): Promise<WorldEntity[]> => {
	return await get(version, fetch, baseUrl, '/defs/worldEntities.json');
};

export const fetchWorldEntityDefs = async (
	version: ClientCacheVersion,
	fetch: Fetch,
	baseUrl: string = ''
): Promise<WorldEntityDef[]> => {
	return await get(version, fetch, baseUrl, '/defs/worldEntityDefs.json');
};

export const fetchWorldEntities = async (
	version: ClientCacheVersion,
	fetch: Fetch,
	baseUrl: string = ''
): Promise<
	{
		worldEntity: WorldEntity;
		worldEntityDef: WorldEntityDef;
	}[]
> => {
	const worldEntities = await fetchWorldEntityInstances(version, fetch, baseUrl);
	const worldEntityDefs = await fetchWorldEntityDefs(version, fetch, baseUrl);

	return worldEntityDefs.map((def) => ({
		worldEntity: worldEntities.find((w) => w.type === def.type),
		worldEntityDef: def
	}));
};
