export interface NpcLoot {
	rareLootTable: LootTable;
	rootLootTables: LootTable[];
	npcLootTables: NpcLootTable[];
}

export interface NpcLootTable {
	_id: number;
	npc: string;
	rareLootProbability: number;
	rootLoot?: RootLoot;
	baseLoot: Loot[];
	loot: Loot[];
}

export interface Loot {
	itemId: number;
	name: string;
	isIOU: boolean;
	amount: number;
	odds?: number;
}

export interface RootLoot {
	probability: number;
	tableId: number;
}

export interface LootTable {
	_id: number;
	rareLootProbability: number;
	rootLoot: null;
	loot: Loot[];
	desc?: string;
}
