export interface SkillAmount {
	skill: string;
	amount: number;
}

export interface Recipe {
	desc: string;
	itemId: number;
	amount: number;
}

export interface ItemDef {
	_id: number;
	name: string;
	description: string;
	isNamePlural: boolean;
	cost: number;
	isStackable: boolean;
	isTradeable: boolean;
	isForMission: boolean;
	isMembers: boolean;
	canIOU: boolean;
	inventoryActions: string[];
	edibleEffects: SkillAmount[];
	equippableEffects: SkillAmount[];
	equippableRequirements: SkillAmount[];
	equipmentType: string;
	equipmentSpriteId: number;
	equipmentSpriteSheet: string;
	resourceProbability: number;
	expFromObtaining: SkillAmount;
	recipe: Recipe[];
	metalType: string;
}
