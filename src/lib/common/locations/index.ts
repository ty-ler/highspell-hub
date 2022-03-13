import { orderBy } from 'lodash-es';
import type { CSSStyles } from 'src/interfaces/common/style';

export interface Location {
	name: string;
	x?: number;
	y?: number;
	style?: CSSStyles;
}

export const locations: Location[] = orderBy(
	[
		{
			name: 'Seashell Shores',
			x: 0,
			y: 493,
			style: {
				'white-space': 'nowrap'
			}
		},
		{
			name: 'Mount Tan',
			x: 32,
			y: 455
		},
		{
			name: 'Cairn',
			x: 160,
			y: 432,
			style: {
				'font-weight': 'bold'
			}
		},
		{
			name: 'Quarry',
			x: 88,
			y: 368
		},
		{
			name: 'Fymel Pond',
			x: 196,
			y: 286
		},
		{
			name: 'Land of Elves',
			x: 265,
			y: 190
		},
		{
			name: 'Quarry',
			x: 408,
			y: 45
		},
		{
			name: 'Celadon City',
			x: 320,
			y: -15,
			style: {
				'font-weight': 'bold'
			}
		},
		{
			name: 'Wastelands',
			x: 335,
			y: -205
		},
		{
			name: 'Swamp',
			x: 200,
			y: -84
		},
		{
			name: 'Barbarian Base',
			x: 180,
			y: 2
		},
		{
			name: 'Quarry',
			x: 108,
			y: -42
		},
		{
			name: 'Lake Mead',
			x: 135,
			y: 78
		},
		{
			name: "Wizard's Lookout",
			x: 95,
			y: 65
		},
		{
			name: 'Gnome Hill',
			x: 28,
			y: -16
		},
		{
			name: 'Middlefern',
			x: 80,
			y: -112,
			style: {
				'font-weight': 'bold'
			}
		},
		{
			name: "Ned's Squirrel Ranch",
			x: -22,
			y: -110
		},
		{
			name: 'Anglham Castle',
			x: 110,
			y: -185,
			style: {
				'font-weight': 'bold'
			}
		},
		{
			name: "Knight's Tower",
			x: 111,
			y: -286
		},
		{
			name: 'Hifrost Peak',
			x: 108,
			y: -338
		},
		{
			name: 'Evil Cult',
			x: 56,
			y: -350
		},
		{
			name: 'Abandoned Guard Tower',
			x: 13,
			y: -304,
			style: {
				width: '130px'
			}
		},
		{
			name: "Sato's Dojo",
			x: -49,
			y: -384
		},
		{
			name: 'Goblin Beach',
			x: -75,
			y: -418
		},
		{
			name: 'Summerton',
			x: -161,
			y: -336,
			style: {
				'font-weight': 'bold'
			}
		},
		{
			name: 'Stone Henge',
			x: -90,
			y: -250
		},
		{
			name: "Percy's Mansion",
			x: -56,
			y: -296
		},
		{
			name: 'Banton',
			x: -68,
			y: -178,
			style: {
				'font-weight': 'bold'
			}
		},
		{
			name: 'Mount Pine',
			x: -210,
			y: -325
		},
		{
			name: 'High Cove',
			x: -250,
			y: -354,
			style: {
				'font-weight': 'bold',
				'white-space': 'nowrap'
			}
		},
		{
			name: 'Mount Silver',
			x: -300,
			y: -160
		},
		{
			name: 'Dwarf Caverns',
			x: -322,
			y: -54
		},
		{
			name: 'Hedgecastle',
			x: -342,
			y: 7,
			style: {
				'font-weight': 'bold'
			}
		},
		{
			name: 'Farmland',
			x: -199,
			y: 48
		},
		{
			name: "Bandit's Ridge",
			x: -200,
			y: -112
		},
		{
			name: 'Goblin Territory',
			x: -180,
			y: -62
		},
		{
			name: 'Minse Pond',
			x: -230,
			y: 128
		},
		{
			name: 'Cyan Bridge',
			x: -135,
			y: 183.5
		},
		{
			name: 'Lake Cyan',
			x: -120,
			y: 252
		},
		{
			name: 'Dry Pond',
			x: -161,
			y: -6
		},
		{
			name: 'North Kabe Plains',
			x: -58,
			y: 100
		},
		{
			name: 'South Kabe Plains',
			x: -94,
			y: -26
		},
		{
			name: 'Citrine City',
			x: 12,
			y: 208,
			style: {
				'font-weight': 'bold'
			}
		},
		{
			name: "Pirate's Bay",
			x: -352,
			y: -302
		}
	],
	(loc) => loc.name
);
