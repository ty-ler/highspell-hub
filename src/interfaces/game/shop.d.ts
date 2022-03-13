export interface Shop {
	_id: number;
	name: string;
	description: string;
	canBuyTemporaryItems: boolean;
	items: ShopItem[];
}

export interface ShopItem {
	id: number;
	amount: number;
	cost: number;
	restockSpeed: number;
}
