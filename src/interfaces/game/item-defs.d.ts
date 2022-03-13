import type { GroundItem } from './ground-items';

export interface ItemDef {
	_id: number;
	name: string;
	description: string;
	isNamePlural: boolean;
	cost: number;
	isStackable: boolean;
	isTradeable: boolean;
	isForMission?: boolean;
	isMembers: boolean;
	canIOU: boolean;
	inventoryActions: InventoryAction[];
	edibleEffects: SkillAmount[];
	equippableEffects: SkillAmount[];
	equippableRequirements: SkillAmount[];
	equipmentType: EquipmentType;
	equipmentSpriteId: number;
	equipmentSpriteSheet: EquipmentSpriteSheet;
	resourceProbability: number;
	expFromObtaining: SkillAmount;
	recipe: Recipe[];
	metalType?: MetalType;
	weaponSpeed?: number;
	removeEquipmentOnEquip?: EquipmentType[];
	hidesSpritesUnderneath?: boolean;
	useItemOnItemActions?: UseItemOnItemAction[];
	edibleResult?: EdibleResult;

	/** custom properties */
	icon?: string;
	groundItems: GroundItem[];
}

export interface SkillAmount {
	skill: Skill;
	amount: number;
}

export enum Skill {
	Accuracy = 'accuracy',
	Cooking = 'cooking',
	Crafting = 'crafting',
	Crime = 'crime',
	Defense = 'defense',
	Enchanting = 'enchanting',
	Fishing = 'fishing',
	Forestry = 'forestry',
	Harvesting = 'harvesting',
	Hitpoints = 'hitpoints',
	Magic = 'magic',
	Mining = 'mining',
	Potionmaking = 'potionmaking',
	Range = 'range',
	Smithing = 'smithing',
	Strength = 'strength'
}

export interface EdibleResult {
	id: number;
	amount: number;
	isIOU: boolean;
}

export enum EquipmentSpriteSheet {
	Back1 = 'back1',
	Chest1 = 'chest1',
	Gloves1 = 'gloves1',
	Helmet1 = 'helmet1',
	Legs1 = 'legs1',
	Neck = 'neck',
	Shield1 = 'shield1',
	Weapon1 = 'weapon1'
}

export enum EquipmentType {
	Back = 'back',
	Chest = 'chest',
	Gloves = 'gloves',
	Helmet = 'helmet',
	Legs = 'legs',
	Neck = 'neck',
	Projectile = 'projectile',
	Shield = 'shield',
	Weapon = 'weapon'
}

export enum InventoryAction {
	Drink = 'drink',
	Eat = 'eat',
	Equip = 'equip',
	Open = 'open'
}

export enum MetalType {
	Bronze = 'bronze',
	Celadium = 'celadium',
	Coronium = 'coronium',
	Gold = 'gold',
	Iron = 'iron',
	Palladium = 'palladium',
	Silver = 'silver',
	Steel = 'steel'
}

export interface Recipe {
	desc: string;
	itemId: number;
	amount: number;
}

export interface UseItemOnItemAction {
	targetItemId: number;
	skillToCreate: Skill;
	canCreateMultiple: boolean;
	resultItems: EdibleResult[];
	itemsToRemove: EdibleResult[];
	resultEntityId: null;
}
