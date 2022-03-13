export interface QuestDef {
	id: number;
	name: string;
	startPoint: QuestStartPoint;
}

export interface QuestStartPoint {
	type: 'npc' | 'action' | 'item';
	npcId?: number;
	itemId?: number;
	actionDesc?: string;
	actionX?: number;
	actionY?: number;
}

export const questDefs: QuestDef[] = [
	{
		id: 0,
		name: 'The Lost Trumpet',
		startPoint: {
			type: 'npc',
			npcId: 35 // Ronald
		}
	}
];
