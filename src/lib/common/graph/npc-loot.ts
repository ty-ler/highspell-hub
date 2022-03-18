import type { Loot, LootTable, NpcLootTable } from 'src/interfaces/game/npc-loot';

export const filterLoot = (loot: Loot[], cb: (l: Loot) => boolean) => {
	if (!loot) return [];

	return loot.filter((l) => cb(l));
};

export const filterLootByItemId = (loot: Loot[], itemId: number) => {
	if (!loot) return [];

	return filterLoot(loot, (l) => l.itemId === itemId);
};

export const filterLootTableByItemId = (lootTable: LootTable, itemId: number): LootTable => {
	return {
		...lootTable,
		loot: filterLootByItemId(lootTable.loot, itemId)
	};
};

export const filterNpcLootTableByItemId = (
	npcLooTable: NpcLootTable,
	itemId: number
): NpcLootTable => {
	return {
		...npcLooTable,
		baseLoot: filterLootByItemId(npcLooTable.baseLoot, itemId),
		loot: filterLootByItemId(npcLooTable.loot, itemId)
	};
};

export const filterNpcLootTablesByItemId = (npcLootTables: NpcLootTable[], itemId: number) => {
	return npcLootTables.filter((t) => {
		const baseLoot = t.baseLoot?.filter((l) => l.itemId === itemId);
		const loot = t.loot?.filter((l) => l.itemId === itemId);
		return !!(baseLoot?.length > 0 || loot?.length > 0);
	});
};

export const filterNpcLootTableByNpcLootTableId = (
	lootTables: NpcLootTable[],
	npcLootTableId: number
) => {
	return lootTables.map((l) => l._id === npcLootTableId);
};
