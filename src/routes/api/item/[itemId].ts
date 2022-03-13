import {
	fetchGroundItems,
	fetchItems,
	fetchNpcEntities,
	fetchNpcLoot,
	fetchNpcs,
	fetchQuests,
	fetchShops
} from '$lib/utils/fetch';
import type { Load } from '@sveltejs/kit';
import type { ClientCacheVersion } from 'lib';
import type { ItemDef } from 'src/interfaces/game/item-defs';
import type { GroundItem } from 'src/interfaces/game/ground-items';
import type { Loot, LootTable, NpcLoot, NpcLootTable } from 'src/interfaces/game/npc-loot';
import type { Shop } from 'src/interfaces/game/shop';
import type { Quest } from 'src/interfaces/game/quest';

export interface ItemInformation {
	itemDef: ItemDef;
	groundItems: GroundItem[];
	npcLootTables: NpcLootTable[];
	rareLootTable: boolean;
	shops: Shop[];
	quests: Quest[];
}

const filterNpcLoot = (npcLoot: NpcLoot, itemId: number): NpcLoot => {
	return {
		npcLootTables: npcLoot.npcLootTables.filter(
			(d) => d.loot.filter((l) => l.itemId === itemId)?.length > 0
		),
		rareLootTable:
			npcLoot.rareLootTable.loot.filter((l) => l.itemId === itemId)?.length > 0
				? npcLoot.rareLootTable
				: null,
		rootLootTables: npcLoot.rootLootTables.filter(
			(d) => d.loot.filter((l) => l.itemId === itemId)?.length > 0
		)
	};
};

export const get: Load = async ({ params, url }) => {
	const itemId = Number(params.itemId);
	const baseUrl = url.origin;
	const version: ClientCacheVersion = 'current';

	try {
		const itemDefs: ItemDef[] = await fetchItems(version, fetch, baseUrl);
		const groundItems: GroundItem[] = await fetchGroundItems(version, fetch, baseUrl);
		const lootTables: NpcLoot = await fetchNpcLoot(version, fetch, baseUrl);
		const shops: Shop[] = await fetchShops(version, fetch, baseUrl);
		const quests = await fetchQuests(version, fetch, baseUrl);

		const itemDef = itemDefs.find((d) => d._id === Number(itemId));
		if (!itemDef)
			return {
				body: {
					error: {
						message: 'Item ID not found'
					}
				},
				status: 404
			};

		const matchingGroundItems = groundItems?.filter((i) => i.itemId === itemId) ?? [];
		const matchingNpcLootTables = lootTables.npcLootTables.filter((t) =>
			t?.loot?.find((l) => l.itemId === itemId)
		);
		const rareLootTable = !!lootTables.rareLootTable.loot.find((l) => l.itemId === itemId);
		const matchingShops =
			shops?.filter((s) => s.items.filter((i) => i.id === itemId)?.length > 0) ?? [];
		const matchingQuests =
			quests?.filter((q) => q?.reward?.items.filter((i) => i.itemId === itemId)?.length > 0) ?? [];

		const itemInfo: ItemInformation = {
			itemDef,
			groundItems: matchingGroundItems,
			rareLootTable,
			npcLootTables: matchingNpcLootTables,
			shops: matchingShops,
			quests: matchingQuests
		};

		return {
			body: JSON.stringify(itemInfo, null, 4),
			status: 200
		};
	} catch (e) {
		return {
			body: {
				message: 'Invalid request'
			},
			status: 400
		};
	}
};
