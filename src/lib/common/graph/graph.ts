import type { ItemDef } from 'src/interfaces/game/item-defs';
import type { Conversation } from 'src/interfaces/game/conversation';
import { ConversationDefs, NpcLoot } from './entity';
import { walkConversationForRequirement } from './conversation';
import {
	filterLootTableByItemId,
	filterNpcLootTableByItemId,
	filterNpcLootTablesByItemId
} from './npc-loot';
import type { NpcLoot as INpcLoot } from 'src/interfaces/game/npc-loot';

export enum GraphNodeType {
	ConversationDef = 'ConversationDef',
	GroundItem = 'GroundItem',
	InstancedNpcEntity = 'InstancedNpcEntity',
	ItemDef = 'ItemDef',
	NpcEntity = 'NpcEntity',
	NpcEntityDef = 'NpcEntityDef',
	NpcLoot = 'NpcLoot',
	PickpocketDef = 'PickpocketDef',
	Quest = 'Quest',
	ShopDef = 'ShopDef',
	SpellDef = 'SpellDef',
	WorldEntity = 'WorldEntity',
	WorldEntityDef = 'WorldEntityDef',
	WorldEntityLootDef = 'WorldEntityLootDef'
}

export interface GraphNode<T = any> {
	type: GraphNodeType;
	ref: T;
	relationshipTypes?: GraphNodeType[];
	relationships?: GraphNode[];
}

const getItemDefNode = (itemDef: ItemDef): GraphNode<ItemDef> => {
	return {
		type: GraphNodeType.GroundItem,
		ref: itemDef,
		relationshipTypes: [
			GraphNodeType.ConversationDef,
			GraphNodeType.NpcLoot,
			GraphNodeType.ShopDef,
			GraphNodeType.SpellDef,
			GraphNodeType.GroundItem,
			GraphNodeType.Quest,
			GraphNodeType.PickpocketDef,
			GraphNodeType.WorldEntityDef,
			GraphNodeType.WorldEntityLootDef
		]
	};
};

/**
 * Get a node of an ItemDef and its relationships.
 *
 * Relationships:
 * - ConversationDef (requirements)
 * - NpcLoot
 * - ShopDef
 * - SpellDef
 * - GroundItem
 * - Quest (reward)
 * - PickpocketDef
 * - WorldEntityDef
 * - WorldEntityLootDef
 */
export const generateItemDefNode = (itemDef: ItemDef): GraphNode<ItemDef> => {
	const itemId = itemDef._id;

	const conversationNodes: GraphNode<Conversation>[] = (ConversationDefs as Conversation[])
		.filter(
			(c: Conversation) =>
				!!walkConversationForRequirement(
					c.result,
					(r) => r?.itemid === itemId || r?.itemids?.includes(itemId)
				)
		)
		.map((c) => ({
			type: GraphNodeType.ConversationDef,
			ref: c
		}));

	const { rareLootTable, npcLootTables, rootLootTables } = NpcLoot as INpcLoot;

	const filteredRlt = filterLootTableByItemId(rareLootTable, itemId);
	const filteredNpcLooTables = filterNpcLootTablesByItemId(npcLootTables, itemId);

	return {
		type: GraphNodeType.ItemDef,
		ref: itemDef,
		relationships: [...conversationNodes]
	};
};
