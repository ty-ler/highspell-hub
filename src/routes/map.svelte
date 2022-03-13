<script lang="ts" context="module">
	import { fetchItems } from '$lib/utils/fetch';
	import type { ClientCacheVersion } from 'lib';

	import type { Load } from '@sveltejs/kit';
	import type { ItemDef } from 'src/interfaces/game/item-defs';

	export const load: Load = async ({ fetch }) => {
		try {
			const version: ClientCacheVersion = 'current';
			const itemDefs = await fetchItems(version, fetch);
			return {
				props: { itemDefs }
			};
		} catch (e) {
			throw e;
		}
	};
</script>

<script lang="ts">
	import Map from '$lib/components/Map/Map.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { fullscreenContent } from '$lib/stores/store';

	export let itemDefs: ItemDef[];

	onMount(() => {
		fullscreenContent.set(true);
	});

	onDestroy(() => {
		fullscreenContent.set(false);
	});
</script>

<div class="map-main-content main-content main-content-fullscreen">
	<Map {itemDefs} />
</div>

<style lang="scss">
	.map-main-content {
		// height: calc(100vh - var(--header-height));
		// max-height: calc(100vh - var(--header-height));
		max-width: 100vw;
		padding: 0;
		overflow: hidden;
	}
</style>
