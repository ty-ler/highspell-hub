<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch }) => {
		try {
			const res = await fetch(`/client-caches/current/compiled/itemDefs/itemDefs.json`);
			const itemDefs = await res.json();

			return {
				status: res.status,
				props: { itemDefs }
			};
		} catch (e) {
			throw e;
		}
	};
</script>

<script lang="ts">
	import ItemsTable from '$lib/components/ItemsTable/ItemsTable.svelte';
	import type { ItemDef } from 'src/interfaces/game/item-defs';

	export let itemDefs: ItemDef[];
</script>

<div class="main-content">
	<ItemsTable clientVersion="current" {itemDefs} />
</div>
