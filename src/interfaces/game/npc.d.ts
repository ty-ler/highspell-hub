export interface NpcEntity {
	_id: number;
	desc: string;
	npcdef_id: number;
	movementAreaMinX: number;
	movementAreaMaxX: number;
	movementAreaMinY: number;
	movementAreaMaxY: number;
	mapLevel: number;
	x: number;
	y: number;
	shopdef_id: number[] | number | null;
	conversationdef_id: number | null;
	stateChangeMessages?: StateChangeMessage[];
	visibilityRequirements?: VisibilityRequirement[];
	interactionRequirements?: null;
	isAlwaysAggroOverride?: boolean;
}

export interface StateChangeMessage {
	state: string;
	type: string;
	messages: string[];
}

export interface VisibilityRequirement {
	desc: string;
	type: string;
	questid: number;
	checkpoint: number;
	operator: string;
}

// NPC Entity Defs

export interface NpcEntityDef {
	_id: number;
	name: string;
	description: string;
	moveEagerness: number;
	canShop: boolean;
	combat: NpcCombat | null;
	appearance: NpcAppearance;
}

export interface NpcAppearance {
	hair?: number;
	beard?: number | null;
	shirt?: number;
	body?: number;
	pants?: number;
	helmet?: number | null;
	chest?: number | null;
	legs?: number | null;
	belt?: null;
	gloves?: number | null;
	boots?: null;
	back?: number | null;
	neck?: number | null;
	weapon?: number | null;
	shield?: number | null;
	width: number;
	height: number;
	creatureType?: NpcCreatureType;
	creatureSpriteId?: number;
	animationSpeed?: number;
}

export enum NpcCreatureType {
	Large = 'large',
	Largest = 'largest',
	Medium = 'medium',
	Small = 'small'
}

export interface NpcCombat {
	level: number;
	hitpoints: number;
	accuracy: number;
	strength: number;
	defense: number;
	magic: number;
	range: number;
	accuracyBonus: number;
	strengthBonus: number;
	defenseBonus: number;
	magicBonus: number;
	rangeBonus: number;
	speed: number;
	aggroRadius: number;
	isAlwaysAggro: boolean;
	respawnLength: number;
	lootTableId: number;
	autoCastSpellIds?: number[];
}

export interface InstancedNpc {
	_id: number;
	desc: string;
	maxIdleTicks: number;
	spawnAtPlayerCurrentPosition: boolean;
	spawnInChatMessages: string[];
	npcdef_id: number;
	movementAreaMinX: number;
	movementAreaMaxX: number;
	movementAreaMinY: number;
	movementAreaMaxY: number;
	mapLevel: number;
	x: number;
	y: number;
	shopdef_id: null;
	conversationdef_id: null;
	isAlwaysAggroOverride?: boolean;
}
