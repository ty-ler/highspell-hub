import type { ItemDef } from 'src/interfaces/game/item-defs';
import type {
	Conversation,
	ConversationOptionRequirement,
	ConversationResult
} from 'src/interfaces/game/conversation';
import { ConversationDefs } from './entity';

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

const walkConversationForRequirement = (
	result: ConversationResult,
	matchCb: (r: ConversationOptionRequirement) => boolean
) => {
	const { options } = result;
	if (!options) return null;
	for (let i = 0; i < options.length; i++) {
		const option = options[i];
		const { requirements } = option;

		if (!requirements || requirements.length === 0) continue;

		// Look for matching item ID in requirements
		const match = requirements.find((r) => matchCb(r));
		if (match) return match;
		else if (!match && option.result) {
			const res = walkConversationForRequirement(option.result, matchCb);
			if (res) return res;
		}
	}

	return null;
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

	return {
		type: GraphNodeType.ItemDef,
		ref: itemDef,
		relationships: [...conversationNodes]
	};
};
