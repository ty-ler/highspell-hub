export interface Spell {
	_id: number;
	name: string;
	desc: string;
	type: string;
	lvl: number;
	exp: number;
	maxDamage: number;
	recipe: SpellRecipe[];
}

export interface SpellRecipe {
	itemId: number;
	amount: number;
}
