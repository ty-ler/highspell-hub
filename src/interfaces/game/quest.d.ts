export interface Quest {
	_id: number;
	name: string;
	desc: string;
	reward: QuestReward;
	checkpoints: QuestCheckpoint[];
}

export interface QuestCheckpoint {
	_id: number;
	hint: string;
}

export interface QuestReward {
	exp: QuestExp;
	items: QuestItem[];
}

export interface QuestExp {
	skill: string;
	amount: string;
}

export interface QuestItem {
	itemId: number;
	amt: number;
	isIOU: boolean;
}
