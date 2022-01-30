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
	import ItemsTable from '$lib/components/ItemsTable.svelte';
	import type { ItemDef } from 'src/models/item-defs';

	export let itemDefs: ItemDef[];
</script>

<ItemsTable {itemDefs} />
