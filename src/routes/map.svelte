<script lang="ts" context="module">
	import { fetchItemDefs } from '$lib/utils/fetch';

	import type { Load } from '@sveltejs/kit';
	import type { ItemDef } from 'src/interfaces/item-defs';
	import { onMount } from 'svelte';

	export const load: Load = async ({ fetch }) => {
		try {
			const version: ClientCacheVersion = 'current';
			const itemDefs = await fetchItemDefs(version, fetch);
			return {
				props: { itemDefs, version }
			};
		} catch (e) {
			throw e;
		}
	};
</script>

<script lang="ts">
	import * as d3 from 'd3';
	import { filter } from 'lodash-es';
	import type { ClientCacheVersion } from 'lib';
	import type { GroundItem } from 'src/interfaces/ground-items';
	import { locations } from '$lib/game/locations';
	import { group, select } from 'd3';
	import { at, max } from 'lodash';
	import { attr } from 'svelte/internal';
	import type { Mouse } from 'puppeteer';

	interface Coordinates {
		width: number;
		height: number;
	}

	interface MapState {
		showGroundItems: boolean;
		showGroundItemCoordinates: boolean;
		showLocations: boolean;
	}

	interface MapFontSize {
		min: number;
		max: number;
	}

	interface MapFontSizes {
		groundItems: MapFontSize;
		locations: MapFontSize;
	}

	export let itemDefs: ItemDef[];
	export let version: ClientCacheVersion;

	const MAP_SIZE = 1024;

	const itemDefsWithGroundItems = () => [...itemDefs?.filter((def) => !!def.groundItems)];

	const cachedMapStateKey = 'map-state';
	const cacheMapState = () => {
		localStorage.setItem(cachedMapStateKey, JSON.stringify(mapState));
	};

	const getCachedMapState = (): MapState => {
		const defaultMapState: MapState = {
			showGroundItemCoordinates: false,
			showGroundItems: false,
			showLocations: true
		};

		try {
			return JSON.parse(localStorage.getItem(cachedMapStateKey)) || defaultMapState;
		} catch (e) {
			return defaultMapState;
		}
	};

	let mapState: MapState = getCachedMapState();
	let mapFontSizes: MapFontSizes = {
		groundItems: {
			min: 6,
			max: 12
		},
		locations: {
			min: 12,
			max: 18
		}
	};

	let displayedItemDefs: ItemDef[] = itemDefsWithGroundItems();

	let mapContainer: HTMLElement;
	let mapImage: HTMLImageElement;
	let mapImageDetails: HTMLImageElement;

	let _canvas: HTMLCanvasElement;
	let _context: CanvasRenderingContext2D;

	let filterValue: string = '';
	let zoomTransform: any;
	let debug: boolean = false;

	const handleChangeItemFilterField = (event: Event) => {
		const value = (event.target as HTMLInputElement).value;
		filterValue = value.toLowerCase();

		filterMapItems(filterValue);
	};

	const handleChangeShowCoordinates = (e: Event) => {
		const checkboxElement = e.target as HTMLInputElement;
		const checked = checkboxElement.checked;
		mapState.showGroundItemCoordinates = checked;
		cacheMapState();

		buildMap();
	};

	const handleChangeShowGroundItems = (e: Event) => {
		const checkboxElement = e.target as HTMLInputElement;
		const checked = checkboxElement.checked;

		mapState.showGroundItems = checked;
		cacheMapState();

		buildMap();
	};

	const handleResize = (e: Event) => {
		buildMap();
	};

	const filterMapItems = (value: string) => {
		if (!value) {
			displayedItemDefs = itemDefsWithGroundItems();
			buildMap();
			return;
		}

		const filterItems = value.split(',').map((v) => v.trim());
		const singleItem = filterItems.length === 1;

		displayedItemDefs = filter(itemDefsWithGroundItems(), (def: ItemDef) => {
			const name = def.name.toLowerCase();

			return (
				def.groundItems && (singleItem ? name.includes(filterItems[0]) : filterItems.includes(name))
			);
		});

		buildMap();
	};

	let scale: number = 1;
	// let maxScale: number = 1;
	let minDotRadius: number = 0.5;
	let maxDotRadius: number = 1;

	let groundItemFontSize: number = mapFontSizes.groundItems.max;
	let locationFontSize: number = mapFontSizes.locations.max;
	let locationStrokeWidth: number = 1;
	let dotRadius: number = maxDotRadius;

	const getTextWidth = (text: string, fontSize: number, fontFace: string) => {
		_context.font = fontSize + 'px ' + fontFace;
		return _context.measureText(text).width;
	};

	const worldToPixel = (value: number, reverse: boolean): number => {
		const center = MAP_SIZE / 2;
		return Math.abs(value + (reverse ? center * -1 : center));
	};

	// const pixelToWorld = (value: number, reverse: boolean): number => {
	// 	const center = MAP_SIZE / 2;
	// 	return value - (reverse ? center * -1 : center);
	// };

	const overlapping = (rect1: DOMRect, rect2: DOMRect) => {
		const padding = 0;
		return !(
			rect1.left >= rect2.right ||
			rect1.top >= rect2.bottom ||
			rect1.right <= rect2.left ||
			rect1.bottom <= rect2.top
		);
	};

	const groundItemName = (itemDef: ItemDef, groundItem: GroundItem) => {
		let name = `${itemDef.name}${groundItem.amount > 1 ? ` (${groundItem.amount})` : ''}`;

		if (mapState.showGroundItemCoordinates) name += ` (x: ${groundItem.x}, y: ${groundItem.y})`;
		if (debug)
			name += ` ([pixel space] x: ${worldToPixel(groundItem.x, false)}, y: ${worldToPixel(
				groundItem.y,
				true
			)})`;
		return name;
	};

	const buildMap = () => {
		const svg = d3.selectAll('#map-svg').attr('viewBox', `0 0 ${MAP_SIZE} ${MAP_SIZE}`);
		// .on('mousemove', (e: MouseEvent) => {
		// 	console.log(pixelToWorld(e.clientX, false));
		// });
		svg.selectAll('*').remove();

		const mapElementsGroup = svg.append('g').attr('id', 'map-elements-group');

		mapElementsGroup
			.append('image')
			.attr('id', 'svg-map-image')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('xlink:href', `client-caches/${version}/gameAssets/earthOverworldMap.png`);

		mapElementsGroup
			.append('image')
			.attr('id', 'svg-map-details')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('xlink:href', `client-caches/${version}/gameAssets/earthOverworldMinimap.png`);

		if (zoomTransform) {
			mapElementsGroup.attr('transform', zoomTransform);
		}

		const worldTopLeft: [number, number] = [0, 0];
		const worldBottomRight: [number, number] = [MAP_SIZE, MAP_SIZE];

		const maxScaleExtent = 6;

		const zoom = d3
			.zoom()
			.scaleExtent([1, maxScaleExtent])
			.translateExtent([worldTopLeft, worldBottomRight])
			.on('zoom.general', (e) => {
				const { transform, sourceEvent } = e;

				zoomTransform = transform;
				scale = transform.k;

				mapElementsGroup.attr('transform', transform);
			});

		if (mapState.showGroundItems) {
			const groundItemsGroup = mapElementsGroup.append('g').attr('id', 'ground-items-group');

			const correctOverlappingText = (
				texts: d3.Selection<SVGTextElement, GroundItem, SVGGElement, unknown>
			) => {
				texts.each(function (di) {
					const that = this;
					const thatSelect = d3.select(that);
					const a = this.getBoundingClientRect();

					texts.each(function (dj) {
						if (this !== that) {
							const thisSelect = d3.select(this);
							const b = this.getBoundingClientRect();

							if (overlapping(a, b)) {
							} else if (thatSelect.style('display') === 'none') {
								return;
							}
						}
					});
				});
			};

			const groundItemGroups = displayedItemDefs.map((def, idx) => {
				const circleGroup = groundItemsGroup.selectAll('#map-svg').data(def.groundItems).join('g');

				const circles = circleGroup
					.append('circle')
					.attr('cx', (d) => worldToPixel(d.x, false))
					.attr('cy', (d) => worldToPixel(d.y, true))
					.attr('r', dotRadius)
					.style('fill', 'red');

				const texts = circleGroup
					.append('text')
					.text((d) => groundItemName(def, d))
					.attr('fill', 'white')
					.attr('font-size', `${groundItemFontSize}px`)
					.attr(
						'dx',
						(d) =>
							worldToPixel(d.x, false) -
							getTextWidth(groundItemName(def, d), groundItemFontSize, 'Arial') / 2
					)
					.attr('dy', (d) => worldToPixel(d.y + 2, true));

				return {
					circles,
					texts,
					def
				};
			});

			zoom.on('zoom.ground-items', (e) => {
				const { sourceEvent } = e;
				if (!sourceEvent.buttons) {
					groundItemGroups.map((group) => {
						const { def, texts, circles } = group;

						const minFontSize = mapFontSizes.groundItems.min;
						const maxFontSize = mapFontSizes.groundItems.max;
						groundItemFontSize = Math.max(maxFontSize / scale, minFontSize);
						dotRadius = Math.max(maxDotRadius / scale, minDotRadius);

						texts.attr('font-size', `${groundItemFontSize}px`);
						texts.attr(
							'dx',
							(d) =>
								worldToPixel(d.x, false) -
								getTextWidth(groundItemName(def, d), groundItemFontSize, 'Arial') / 2
						);

						circles.attr('r', dotRadius);
					});
				}
			});
		}

		if (mapState.showLocations) {
			const locationsGroup = mapElementsGroup.append('g').attr('id', 'locations-group');

			const singleLineMapLocationDefs = locations.filter(
				(d) => !d.nameLineBreak && d.x != null && d.y != null
			);
			const multiLineMapLocationDefs = locations.filter(
				(d) => d.nameLineBreak && d.x != null && d.y != null
			);

			const singleLineMapLocations = locationsGroup
				.selectAll('text')
				.data(singleLineMapLocationDefs)
				.join('text')
				// .text((d) => d.name)
				.attr('font-size', `${locationFontSize}px`)
				.attr('font-weight', 'bold')
				.attr('fill', 'white')
				.attr('stroke', 'black')
				.attr('stroke-width', `${locationStrokeWidth}px`)
				.attr('dx', (d) => d.x - getTextWidth(d.name, locationFontSize, 'Arial') / 2)
				.attr('dy', (d) => d.y)
				.text((d) => d.name);

			const multiLineMapLocations = locationsGroup
				.selectAll('g')
				.data(multiLineMapLocationDefs)
				.join('g');
			const maxTextWidths = multiLineMapLocationDefs.map((def) =>
				Math.max(
					...def.name
						.split(' ')
						.map((namePart) => getTextWidth(namePart, locationFontSize, 'Arial'))
				)
			);

			multiLineMapLocations.each((d, i, groups) => {
				const nameSplit = d.name.split(' ');
				const selection = d3.select(groups[i]);

				const maxTextWidth = maxTextWidths[i];

				nameSplit.map((namePart, j) => {
					selection
						.append('text')
						.text(namePart)
						.attr('font-size', `${locationFontSize}px`)
						.attr('font-weight', 'bold')
						.attr('fill', 'white')
						.attr('stroke', 'black')
						.attr('stroke-width', `${locationStrokeWidth}px`)
						.attr(
							'dx',
							d.x +
								(maxTextWidth - getTextWidth(namePart, locationFontSize, 'Arial')) / 2 -
								maxTextWidth / 2
						)
						.attr('dy', d.y + j * locationFontSize);
				});
			});

			zoom.on('zoom.locations', (e) => {
				const { sourceEvent } = e;

				const minFontSize = mapFontSizes.locations.min;
				const maxFontSize = mapFontSizes.locations.max;
				locationFontSize = Math.max(maxFontSize / scale, minFontSize);
				locationStrokeWidth = Math.max(1 / scale, 0.25);

				if (!sourceEvent.buttons) {
					singleLineMapLocations
						.attr('font-size', `${locationFontSize}px`)
						.attr('stroke-width', `${locationStrokeWidth}px`)
						.attr('dx', (d) => d.x - getTextWidth(d.name, locationFontSize, 'Arial') / 2);

					multiLineMapLocations.each(function (d, i) {
						const selection = d3.select(this);
						selection
							.selectAll('text')
							.attr('font-size', `${locationFontSize}px`)
							.attr('stroke-width', `${locationStrokeWidth}px`)
							.attr('dx', function (_d: any) {
								const selection = d3.select(this);
								const namePart = selection.text();
								const maxTextWidth = maxTextWidths[i];

								return (
									_d.x +
									(maxTextWidth - getTextWidth(namePart, locationFontSize, 'Arial')) / 2 -
									maxTextWidth / 2
								);
							})
							.attr('dy', (_d: any, j) => _d.y + j * locationFontSize);
					});
				}
			});
		}

		svg.call(zoom);
	};

	onMount(() => {
		_canvas = document.createElement('canvas');
		_context = _canvas.getContext('2d');

		mapContainer = document.getElementById('map-container');
		mapImage = document.getElementById('map-image') as HTMLImageElement;
		mapImageDetails = document.getElementById('map-details') as HTMLImageElement;

		// canvasWidth = mapImage.clientWidth;
		// canvasHeight = mapImage.clientHeight;

		buildMap();

		filterMapItems(filterValue);
	});
</script>

<svelte:window on:resize={(e) => handleResize(e)} />

<!-- <div class="map-host"> -->
<div class="map-host-content">
	<div class="map-toolbar">
		<input
			placeholder="Filter by item name"
			class="filter-input"
			value={filterValue}
			on:input={(e) => handleChangeItemFilterField(e)}
		/>
		<div class="ground-items-checkboxes">
			<div class="checkbox-container">
				<input
					type="checkbox"
					id="ground-items-toggle"
					name="ground-items-toggle"
					checked={mapState.showGroundItems}
					on:change={(e) => handleChangeShowGroundItems(e)}
				/>
				<label class="no-select" for="ground-items-toggle">Ground Items</label>
			</div>
			<div class="checkbox-container">
				<input
					type="checkbox"
					id="coordinates-toggle"
					name="coordinates-toggle"
					checked={mapState.showGroundItems && mapState.showGroundItemCoordinates}
					disabled={!mapState.showGroundItems}
					on:change={(e) => handleChangeShowCoordinates(e)}
				/>
				<label class="no-select" for="coordinates-toggle">Ground Item Coordinates</label>
			</div>
		</div>
	</div>
	<div class="map-scroll-container">
		<div
			id="map-container"
			on:scroll={(e) => e.preventDefault()}
			on:wheel={(e) => e.preventDefault()}
		>
			{#if debug}
				<!-- <div class="debug-circle" /> -->
				<div class="map-axis axis-v-min">512 (top: 0px)</div>
				<div class="map-axis axis-v-max">-512 (top: 1024px)</div>
				<div class="map-axis axis-h-min">-512 (left: 0px)</div>
				<div class="map-axis axis-h-max">512 (left: 1024)</div>
			{/if}
			<svg id="map-svg" />
			<!-- svelte-ignore a11y-missing-attribute -->
			<img id="map-details" src="client-caches/{version}/gameAssets/earthOverworldMinimap.png" />
			<img id="map-image" src="client-caches/{version}/gameAssets/earthOverworldMap.png" />
		</div>
	</div>
</div>

<!-- </div> -->
<style lang="scss">
	.map-host {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.map-host-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		// overflow-x: auto;
		height: 100%;
	}

	.map-toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
		align-self: flex-start;
		// position: sticky;
		// top: 0;
		// width: 100%;
		z-index: 10;
		background: white;
		padding: 1rem;
	}

	.ground-items-checkboxes {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;

		#coordinates-toggle {
			// margin-left: 1rem;
		}
	}

	.map-scroll-container {
		display: flex;
		justify-content: center;
		width: 100%;
		height: 100%;
		min-height: 0;
		padding-bottom: 1rem;
		// overflow: auto;
	}

	.debug-circle {
		--debug-circle-size: 1px;

		position: absolute;
		border-radius: 50%;
		min-width: var(--debug-circle-size);
		min-height: var(--debug-circle-size);
		background: violet;
		top: calc(549px - (var(--debug-circle-size) / 2));
		left: calc(679px - (var(--debug-circle-size) / 2));
		z-index: 100;
	}

	#map-container {
		// min-width: var(--canvas-width);
		// min-height: var(--canvas-height);
		// max-width: var(--canvas-width);
		// max-height: var(--canvas-height);

		display: flex;
		position: relative;
		overflow: hidden;
		user-select: none;

		background-size: 36px 36px;
		background-image: linear-gradient(to right, grey 1px, rgba(black, 0.025) 1px),
			linear-gradient(to bottom, grey 1px, rgba(black, 0.025) 1px);
		background-position: center;
		display: flex;

		cursor: grab;

		&:active {
			cursor: grabbing;
		}

		.map-axis {
			display: flex;
			// display: none;
			position: absolute;
			top: 0;
			height: 100%;
			width: 100%;
			color: red;
			font-weight: bold;
			z-index: 100;
			pointer-events: none;

			&::after {
				content: '';
			}

			&.axis-v-min {
				// top: 0;
				// left: 50%;
				// transform: translateX(-50%);
				justify-content: center;
				align-items: flex-start;

				&::after {
					position: absolute;
					height: 100%;
					width: 1px;
					background: orange;
				}
			}

			&.axis-v-max {
				// bottom: 0;
				// left: 50%;
				// transform: translateX(-50%);
				justify-content: center;
				align-items: flex-end;
			}

			&.axis-h-min {
				// top: 50%;
				// left: 0;
				// transform: translateY(-50%);
				justify-content: flex-start;
				align-items: center;

				&::after {
					position: absolute;
					width: 100%;
					height: 1px;
					background: orange;
				}
			}

			&.axis-h-max {
				// top: 50%;
				// right: 0;
				// transform: translateY(-50%);
				justify-content: flex-end;
				align-items: center;
			}
		}

		:globa {
			#svg-map-image,
			#svg-map-details {
				width: 100%;
				height: 100%;
			}
		}

		#map-details,
		#map-svg {
			position: absolute;
			top: 0;
			left: 0;
		}

		#map-image,
		#map-details {
			pointer-events: none;
			visibility: hidden;
		}

		#map-svg {
			width: 100%;
			height: 100%;
		}

		#map-image {
			z-index: 1;
		}

		#map-details {
			z-index: 2;
			// transform: scale(-300%);
			height: 100%;
			width: 100%;
		}

		#map-svg {
			z-index: 3;
		}

		:global {
			.multi-line-location {
				display: flex;
				align-items: center;
				justify-content: center;
				text-align: center;
				// -webkit-text-stroke: 1px black;
			}
		}
	}
</style>
