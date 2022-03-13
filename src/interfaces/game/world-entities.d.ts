export interface WorldEntity {
	_id: number;
	type: string;
	dir: WorldEntityDirection;
	lvl: number;
	x: number;
	y: number;
	z: number;
	xOff: number;
	yOff: number;
	l: number;
	w: number;
	h: number;
	solid: boolean;
	mesh: null | string;
	mat: null | string;
	gloss: WorldEntityGloss;
	alpha: number;
	light: WorldEntityLight;
	canProjectile?: boolean;
	rot?: string;
	onActions?: WorldEntityOnAction[];
	onClickTeleportTo?: null;
	smoothLighting?: boolean;
	needsHitbox?: boolean;
	descriptionOverride?: string;
	dynamicRotation?: string;
}

export enum WorldEntityDirection {
	DirS = 'S',
	DirW = 'W',
	S = 's',
	SE = 'se',
	Ss = 'Ss',
	Sw = 'sw',
	W = 'w'
}

export enum WorldEntityGloss {
	Gloss111 = '.1,.1,.1',
	The000 = '0,0,0',
	The050505 = '.05,.05,.05',
	The111 = '1,1,1',
	The252525 = '.25,.25,.25',
	The555 = '.5,.5,.5',
	The757575 = '.75,.75,.75'
}

export enum WorldEntityLight {
	Light111 = '.1,.1,.1',
	The028 = '.0,.2,.8',
	The050505 = '.05,.05,.05',
	The05325 = '.05,.3,.25',
	The058 = '0,.5,.8',
	The0950 = '0,.95,0',
	The111 = '1,1,1',
	The130 = '.1,.3,0',
	The1350 = '1,.35,0',
	The252525 = '.25,.25,.25',
	The500 = '.5,0,0',
	The510 = '.5,.1,0',
	The515151 = '.51,.51,.51',
	The5305 = '.5,.3,.05',
	The550 = '.5,.5,0',
	The555 = '.5,.5,.5'
}

export interface WorldEntityOnAction {
	targetAction: TargetAction;
	requirements: OnActionRequirement[];
	playerEventActions: PlayerEventAction[];
}

export interface PlayerEventAction {
	type: PlayerEventActionType;
	location?: InsideLocation;
	insideLocation?: InsideLocation;
	outsideLocation?: InsideLocation;
	playerReceiveItems?: PlayerReceiveItem[];
	sideOne?: InsideLocation;
	sideTwo?: InsideLocation;
	id?: number;
	spawnOnDoorSide?: string;
	requirements?: PlayerEventActionRequirement[];
}

export interface InsideLocation {
	x: number;
	y: number;
	lvl: number;
}

export interface PlayerReceiveItem {
	id: number;
	isIOU: boolean;
	amt: number;
}

export interface PlayerEventActionRequirement {
	desc: string;
	type: RequirementType;
	skill: Skill;
	level: number;
	operator: Operator;
}

export enum Operator {
	Empty = '>=',
	Operator = '==='
}

export enum Skill {
	Crime = 'crime',
	Hitpoints = 'hitpoints',
	Mining = 'mining',
	Potionmaking = 'potionmaking'
}

export enum RequirementType {
	Availableinventoryspace = 'availableinventoryspace',
	Inventoryitem = 'inventoryitem',
	Playerownsitem = 'playerownsitem',
	Quest = 'quest',
	Skill = 'skill'
}

export enum PlayerEventActionType {
	ClimbSameMapLevel = 'ClimbSameMapLevel',
	GoThroughDoor = 'GoThroughDoor',
	MineThroughRocks = 'MineThroughRocks',
	PlayerReceiveItems = 'PlayerReceiveItems',
	SpawnInstancedNPC = 'SpawnInstancedNPC',
	StartBanking = 'StartBanking',
	TeleportTo = 'TeleportTo'
}

export interface OnActionRequirement {
	desc: string;
	type: RequirementType;
	skill?: Skill;
	level?: number;
	operator?: Operator;
	itemid?: number;
	isiou?: boolean;
	amount?: number;
	questid?: number;
	checkpoint?: number;
	availableslotsneeded?: number;
}

export enum TargetAction {
	BankAt = 'bank_at',
	Climb = 'climb',
	ClimbSameMapLevel = 'climb_same_map_level',
	Enter = 'enter',
	Exit = 'exit',
	GoThrough = 'go_through',
	MineThrough = 'mine_through',
	Open = 'open',
	Search = 'search'
}

export interface WorldEntityDef {
	_id: number;
	type: string;
	name: null | string;
	desc: null | string;
	actions: string[];
	respawnTicks: number;
	resourceProbability: number;
	maxResourcesPerSpawn: number;
	useItemWithEntityActions: UseItemWithEntityAction[];
	canProjectile: boolean;
	minResourcesPerSpawn?: number;
}

export interface UseItemWithEntityAction {
	itemId: number;
	action: Action;
}

export enum Action {
	Cooking = 'cooking',
	Enchanting = 'enchanting',
	Usingspinningwheel = 'usingspinningwheel'
}
