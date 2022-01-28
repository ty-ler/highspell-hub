import fs from 'fs';
import path from 'path';

export const clientAssetsPath = path.join(fs.realpathSync('.'), 'client-assets');

export const itemNameToFileName = (itemName: string) => {
	itemName = itemName.toLowerCase();
	const split = itemName.split(' ');
	itemName = split.join('_');
	itemName = `${itemName}.png`;

	return itemName;
};
