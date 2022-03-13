import type { ItemDef } from '../game/item-defs';
import type { Quest } from '../game/quest';

export interface Coordinates {
	x: number;
	y: number;
}

export interface MapApiResponse {
	items: ItemDef[];
	quests: MapQuest[];
}

export interface MapQuest {}
