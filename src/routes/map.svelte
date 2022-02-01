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

	interface Coordinates {
		width: number;
		height: number;
	}

	export let itemDefs: ItemDef[];
	export let version: ClientCacheVersion;

	const itemDefsWithGroundItems = () => [...itemDefs?.filter((def) => !!def.groundItems)];

	let displayedItemDefs: ItemDef[] = itemDefsWithGroundItems();
	let showCoordinates: boolean = false;

	let canvasWidth: number;
	let canvasHeight: number;

	let _canvas: HTMLCanvasElement;
	let _context: CanvasRenderingContext2D;

	const getTextWidth = (text: string, fontSize: number, fontFace: string) => {
		_context.font = fontSize + 'px ' + fontFace;
		return _context.measureText(text).width;
	};

	const worldToPixel = (value: number, maxSize: number): number => {
		return maxSize - value - maxSize / 2;
	};

	const handleChangeItemFilterField = (e: Event) => {
		const inputElement = e.target as HTMLInputElement;
		const filterValue = inputElement.value.toLowerCase();
		if (!filterValue) {
			displayedItemDefs = itemDefsWithGroundItems();
			buildMap();
			return;
		}

		displayedItemDefs = filter(
			itemDefsWithGroundItems(),
			(def: ItemDef) => def.groundItems && def.name.toLowerCase().includes(filterValue)
		);

		buildMap();
	};

	const handleChangeShowCoordinates = (e: Event) => {
		const checkboxElement = e.target as HTMLInputElement;
		const checked = checkboxElement.checked;
		showCoordinates = checked;

		buildMap();
	};

	const groundItemName = (itemDef: ItemDef, groundItem: GroundItem) => {
		let name = `${itemDef.name}${groundItem.amount > 1 ? ` (${groundItem.amount})` : ''}`;
		if (showCoordinates) name += ` (x: ${groundItem.x}, y: ${groundItem.y})`;
		return name;
	};

	const buildMap = () => {
		const svg = d3.selectAll('#map-svg');

		svg.selectAll('*').remove();

		const group = svg.append('g');

		svg.attr('width', canvasWidth).attr('height', canvasHeight);

		displayedItemDefs.map((def) => {
			const circleGroup = group.selectAll('#map-svg').data(def.groundItems).enter().append('g');

			circleGroup
				.append('circle')
				.attr('cx', (d) => {
					return worldToPixel(d.x - 10, canvasWidth);
				})
				.attr('cy', (d) => {
					return worldToPixel(d.y, canvasHeight);
				})
				.attr('r', 1)
				.style('fill', 'red');
			// .style('stroke', 'red');

			circleGroup
				.append('text')
				.text((d) => groundItemName(def, d))
				.attr('fill', 'white')
				.attr('font-size', '16px')
				.attr('dx', (d) => {
					return (
						worldToPixel(d.x - 10, canvasWidth) -
						getTextWidth(groundItemName(def, d), 16, 'Arial') / 2
					);
				})
				.attr('dy', (d) => {
					return worldToPixel(d.y, canvasHeight);
				});
		});
	};

	onMount(() => {
		_canvas = document.createElement('canvas');
		_context = _canvas.getContext('2d');

		const mapContainer = document.getElementById('map-container');
		const mapImage = document.getElementById('map-image');
		const mapCanvas = document.getElementById('map-canvas') as HTMLCanvasElement;

		// const mapContext = mapCanvas.getContext('2d');

		canvasWidth = mapImage.clientWidth;
		canvasHeight = mapImage.clientHeight;

		buildMap();
	});
</script>

<!-- <div class="map-host"> -->
<div class="map-host-content">
	<div class="map-toolbar">
		<input
			placeholder="Filter by item name"
			class="filter-input"
			on:input={(e) => handleChangeItemFilterField(e)}
		/>
		<div class="checkbox-container">
			<input
				type="checkbox"
				id="coordinates-toggle"
				name="coordinates-toggle"
				on:change={(e) => handleChangeShowCoordinates(e)}
			/>
			<label class="no-select" for="coordinates-toggle">Show Coordinates</label>
		</div>
	</div>
	<div
		id="map-container"
		style="--canvas-width: {canvasWidth}px; --canvas-height: {canvasHeight}px;"
	>
		<svg id="map-svg" />
		<!-- svelte-ignore a11y-missing-attribute -->
		<img id="map-details" src="client-caches/{version}/gameAssets/earthOverworldMinimap.png" />
		<img id="map-image" src="client-caches/{version}/gameAssets/earthOverworldMap.png" />
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

	#map-container {
		min-width: var(--canvas-width);
		min-height: var(--canvas-height);
		max-width: var(--canvas-width);
		max-height: var(--canvas-height);

		position: relative;
		overflow: hidden;
		user-select: none;

		#map-details,
		#map-svg,
		#map-canvas {
			position: absolute;
			top: 0;
			left: 0;
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
