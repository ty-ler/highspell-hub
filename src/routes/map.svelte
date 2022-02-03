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
	import { map, transform } from 'lodash';
	import { zoom } from 'd3';

	interface Coordinates {
		width: number;
		height: number;
	}

	export let itemDefs: ItemDef[];
	export let version: ClientCacheVersion;

	const itemDefsWithGroundItems = () => [...itemDefs?.filter((def) => !!def.groundItems)];

	const cacheShowCoordsKey = 'map-show-coordinates';
	const cacheShowCoords = (showCoords: boolean) => {
		localStorage.setItem(cacheShowCoordsKey, JSON.stringify(showCoords));
	};

	const getCachedShowCoords = () => {
		try {
			return JSON.parse(localStorage.getItem(cacheShowCoordsKey)) || false;
		} catch (e) {
			return false;
		}
	};

	let displayedItemDefs: ItemDef[] = itemDefsWithGroundItems();
	let showCoordinates: boolean = getCachedShowCoords();

	let canvasWidth: number;
	let canvasHeight: number;

	let mapContainer: HTMLElement;
	let mapImage: HTMLImageElement;
	let mapImageDetails: HTMLImageElement;

	let _canvas: HTMLCanvasElement;
	let _context: CanvasRenderingContext2D;

	let filterValue: string = 'string,bronze longsword';
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
		showCoordinates = checked;
		cacheShowCoords(showCoordinates);

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

	const getTextWidth = (text: string, fontSize: number, fontFace: string) => {
		_context.font = fontSize + 'px ' + fontFace;
		return _context.measureText(text).width;
	};

	const worldToPixel = (
		value: number,
		maxSize: number,
		reverse: boolean,
		name?: string
	): number => {
		const center = maxSize / 2;

		// return center - Math.abs(value);

		return Math.abs(value + (reverse ? center * -1 : center));
	};

	const groundItemName = (itemDef: ItemDef, groundItem: GroundItem) => {
		let name = `${itemDef.name}${groundItem.amount > 1 ? ` (${groundItem.amount})` : ''}`;

		if (showCoordinates) name += ` (x: ${groundItem.x}, y: ${groundItem.y})`;
		if (debug)
			name += ` ([pixel space] x: ${worldToPixel(
				groundItem.x,
				canvasWidth,
				false
			)}, y: ${worldToPixel(groundItem.y, canvasHeight, true)})`;
		return name;
	};

	const buildMap = () => {
		const svg = d3.selectAll('#map-svg');

		svg.selectAll('*').remove();

		const containerGroup = svg.append('g');

		containerGroup
			.append('svg:image')
			.attr('id', 'svg-map-image')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('xlink:href', `client-caches/${version}/gameAssets/earthOverworldMap.png`);

		containerGroup
			.append('svg:image')
			.attr('id', 'svg-map-details')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('xlink:href', `client-caches/${version}/gameAssets/earthOverworldMinimap.png`);

		if (zoomTransform) {
			containerGroup.attr('transform', zoomTransform);
		}

		const worldTopLeft: [number, number] = [0, 0];
		const worldBottomRight: [number, number] = [canvasWidth, canvasHeight];

		svg.call(
			d3
				.zoom()
				.scaleExtent([1, 5])
				.translateExtent([worldTopLeft, worldBottomRight])
				.on('zoom', (e) => {
					const transform = e.transform;
					zoomTransform = transform;
					containerGroup.attr('transform', transform);
				})
		);

		svg.attr('width', canvasWidth).attr('height', canvasHeight);

		const nodeGroup = containerGroup.append('g');

		displayedItemDefs.map((def, idx) => {
			const circleGroup = nodeGroup.selectAll('#map-svg').data(def.groundItems).enter().append('g');

			circleGroup
				.append('circle')
				.attr('cx', (d) => worldToPixel(d.x, canvasWidth, false, `${def.name} x: `))
				.attr('cy', (d) => worldToPixel(d.y, canvasHeight, true, `${def.name} y: `))
				.attr('r', 1)
				.style('fill', 'red');
			// .style('stroke', 'red');

			circleGroup
				.append('text')
				.text((d) => groundItemName(def, d))
				.attr('fill', 'white')
				.attr('font-size', '16px')
				.attr(
					'dx',
					(d) =>
						worldToPixel(d.x, canvasWidth, false) -
						getTextWidth(groundItemName(def, d), 16, 'Arial') / 2
				)
				.attr('dy', (d) => worldToPixel(d.y + 3, canvasHeight, true));
		});
	};

	onMount(() => {
		_canvas = document.createElement('canvas');
		_context = _canvas.getContext('2d');

		mapContainer = document.getElementById('map-container');
		mapImage = document.getElementById('map-image') as HTMLImageElement;
		mapImageDetails = document.getElementById('map-details') as HTMLImageElement;

		canvasWidth = mapImage.clientWidth;
		canvasHeight = mapImage.clientHeight;

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
		<div class="checkbox-container">
			<input
				type="checkbox"
				id="coordinates-toggle"
				name="coordinates-toggle"
				checked={showCoordinates}
				on:change={(e) => handleChangeShowCoordinates(e)}
			/>
			<label class="no-select" for="coordinates-toggle">Show Coordinates</label>
		</div>
	</div>
	<div class="map-scroll-container">
		<div
			id="map-container"
			style="--canvas-width: {canvasWidth}px; --canvas-height: {canvasHeight}px;"
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
		overflow: auto;
		height: 100%;
	}

	.map-toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
		align-self: flex-start;
		padding: 1rem;
	}

	.map-scroll-container {
		display: flex;
		justify-content: center;
		width: 100%;
		height: 100%;
		overflow: auto;
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
		min-width: var(--canvas-width);
		min-height: var(--canvas-height);
		max-width: var(--canvas-width);
		max-height: var(--canvas-height);

		position: relative;
		overflow: hidden;
		user-select: none;

		background-size: 36px 36px;
		background-image: linear-gradient(to right, grey 1px, rgba(black, 0.025) 1px),
			linear-gradient(to bottom, grey 1px, rgba(black, 0.025) 1px);
		background-position: center;

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
	}
</style>
