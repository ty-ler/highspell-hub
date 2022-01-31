<script lang="ts" context="module">
	import { fetchItemDefs } from '$lib/utils/fetch';

	import type { Load } from '@sveltejs/kit';
	import type { ClientCacheVersion } from 'lib';
	import type { ItemDef } from 'src/models/item-defs';

	export const load: Load = async ({ params, fetch }) => {
		const version = params.version as ClientCacheVersion;

		try {
			const itemDefs = await fetchItemDefs(version, fetch);

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
	import ItemsTable from '$lib/components/ItemsTable.svelte';

	export let version: string;
	export let itemDefs: ItemDef[];
</script>

<ItemsTable clientVersion={version} {itemDefs} />
