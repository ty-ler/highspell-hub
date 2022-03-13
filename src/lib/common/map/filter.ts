import filter from 'lodash/filter';
import type { ItemDef } from 'src/interfaces/game/item-defs';
import type { Location } from '../locations';

export const filterLocations = (filterValue: string, locations: Location[]) => {
	filterValue = filterValue.toLowerCase();
	if (!filterValue) return locations;

	return filter(locations, (l) => l.name.toLowerCase().includes(filterValue));
};

export const filterItems = (filterValue: string, items: ItemDef[]) => {
	filterValue = filterValue.toLowerCase();
	if (!filterValue) return items;

	return filter(items, (i) => i.name.toLowerCase().includes(filterValue));
};
