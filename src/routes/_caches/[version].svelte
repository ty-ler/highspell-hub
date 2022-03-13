<script lang="ts" context="module">
	import { fetchItems } from '$lib/utils/fetch';

	import type { Load } from '@sveltejs/kit';
	import type { ClientCacheVersion } from 'lib';
	import type { ItemDef } from 'src/interfaces/item-defs';

	export const load: Load = async ({ params, fetch }) => {
		const version = params.version as ClientCacheVersion;

		try {
			const itemDefs = await fetchItems(version, fetch);

			return {
				props: {
					version,
					itemDefs
				}
			};
		} catch (e) {
			return {
				props: {
					status: 404
				}
			};
		}
	};
</script>

<script lang="ts">
	import ItemsTable from '$lib/components/ItemsTable/ItemsTable.svelte';

	export let version: string;
	export let itemDefs: ItemDef[];
</script>

<ItemsTable clientVersion={version} {itemDefs} />
