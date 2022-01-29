<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import type { ItemDef as _ItemDef } from 'src/models/item-defs';

	export const load: Load = async ({ fetch }) => {
		try {
			const itemDefsRes = await fetch(`/client-assets/item-defs/item-defs.json`);
			const itemDefs = await itemDefsRes.json();

			const groundItemsRes = await fetch(`/client-assets/defs/groundItems.json`);
			const groundItems = await groundItemsRes.json();

			return {
				props: { itemDefs, groundItems }
			};
		} catch (e) {
			throw e;
		}
	};
</script>

<script lang="ts">
	interface ItemDef extends _ItemDef {}

	export let itemDefs: ItemDef[];
</script>

<h1>Welcome to the Map!</h1>

<img src="client-assets/gameAssets/earthOverworldMap.png" />
