export interface Conversation {
	_id: number;
	description: string;
	result: ConversationResult;
}

export interface ConversationResult {
	npcText?: string;
	options?: ConverationOption[];
	endConversation?: boolean;
	playerEventAction?: PlayerEventAction;
	questAdvancement?: QuestAdvancement;
}

export interface ConverationOption {
	requirements?: ConversationOptionRequirement[];
	text: string;
	result: ConversationResult;
	fullText?: string;
}

export interface ConversationOptionRequirement {
	desc: string;
	type: ConversationOptionRequirementType;
	itemid?: number;
	isiou?: boolean;
	amount?: number;
	operator?: Operator;
	questid?: number;
	checkpoint?: number;
	skill?: string;
	level?: number;
	availableslotsneeded?: number;
	equipmenttype?: string;
	itemids?: number[];
	isequipped?: boolean;
}

export enum Operator {
	GreaterThanEqualTo = '>=',
	LessThanEqualTo = '<=',
	LessThan = '<',
	Equals = '==='
}

export enum ConversationOptionRequirementType {
	Availableinventoryspace = 'availableinventoryspace',
	Equippeditem = 'equippeditem',
	Inventoryitem = 'inventoryitem',
	Playerownsitem = 'playerownsitem',
	Quest = 'quest',
	Skill = 'skill'
}

export interface PlayerEventAction {
	desc?: string;
	type: PlayerEventActionType;
	playerReceiveItems?: PlayerEventActionItemTransaction[];
	shopId?: number;
	playerGiveItems?: PlayerEventActionItemTransaction[];
}

export interface PlayerEventActionItemTransaction {
	id: number;
	isIOU: boolean;
	amt: number;
}

export enum PlayerEventActionType {
	ChangeAppearance = 'ChangeAppearance',
	PlayerExchangeItems = 'PlayerExchangeItems',
	PlayerGiveItems = 'PlayerGiveItems',
	PlayerReceiveItems = 'PlayerReceiveItems',
	StartShopping = 'StartShopping'
}

export interface QuestAdvancement {
	desc: Desc;
	questid: number;
	checkpoint: number;
}

export enum Desc {
	LeprechaunFlute = 'Leprechaun Flute',
	RonaldSTrumpet = "Ronald's Trumpet"
}
