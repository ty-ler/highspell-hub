import { clientAssetsPath, ensureDirExists, itemNameToFileName } from '../lib';
import path from 'path';
import sharp from 'sharp';
import _itemDefs from '../client-assets/defs/itemDefs.json';

const itemDefs = _itemDefs as ItemDef[];

interface SkillAmount {
	skill: string;
	amount: number;
}

interface Recipe {
	desc: string;
	itemId: number;
	amount: number;
}

interface ItemDef {
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

const spriteSize = 48;
const itemsSpriteSheetPath = path.join(clientAssetsPath, 'gameAssets', 'items', 'items.png');
const itemDefsPath = path.join(clientAssetsPath, 'item-defs');
const itemImagesPath = path.join(clientAssetsPath, 'item-images');

const spriteSheetMetadata = await sharp(itemsSpriteSheetPath).metadata();
const { width, height } = spriteSheetMetadata;

const spritesPerRow = Math.max(width, height) / spriteSize;

ensureDirExists(itemDefsPath);
ensureDirExists(itemImagesPath);

let row = -1;
itemDefs.map((def, idx) => {
	const left = (idx % spritesPerRow) * spriteSize;
	if (left === 0) row++;
	const top = row * spriteSize;

	const filename = itemNameToFileName(def.name);
	sharp(itemsSpriteSheetPath)
		.extract({ width: spriteSize, height: spriteSize, left, top })
		.toFile(path.join(itemImagesPath, filename));
});
