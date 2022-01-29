<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch }) => {
		try {
			const res = await fetch(`/client-assets/item-defs/item-defs.json`);
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
	import { onMount } from 'svelte';
	import { orderBy, cloneDeep, filter as _filter } from 'lodash-es';
	import type { ItemDef as _ItemDef } from 'src/models/item-defs';

	interface ItemDef extends _ItemDef {
		icon: string;
	}
	type ItemDefSortKey = keyof ItemDef;
	type SortDirection = 'asc' | 'desc';

	interface Sortable {
		label: string;
		sortKey?: ItemDefSortKey;
		sortDirection?: SortDirection;
		disableSort?: boolean;
	}
	interface Sorted {
		sortKey: ItemDefSortKey;
		direction: SortDirection;
	}

	export let itemDefs: ItemDef[];
	let _defs: ItemDef[] = cloneDeep(itemDefs);

	export let sortables: Sortable[] = [
		{
			label: 'Icon',
			disableSort: true
		},
		{
			label: 'ID',
			sortKey: '_id'
		},
		{
			label: 'Name',
			sortKey: 'name'
		},
		{
			label: 'Description',
			sortKey: 'description'
		},
		{
			label: 'Cost',
			sortKey: 'cost'
		}
	];
	export let selected: ItemDef;
	export let displayedItemDefs: ItemDef[] = _defs;

	const filter = (filterValue: string) => {
		if (!filterValue) {
			displayedItemDefs = _defs;
			if (sorted) sort(sorted, sorted.sortDirection);
			return;
		}
		displayedItemDefs = _filter(_defs, (itemDef) => itemDef.name.includes(filterValue));

		if (sorted) sort(sorted, sorted.sortDirection);
	};

	const sort = (sortable: Sortable, sortDirection?: SortDirection) => {
		if (sortable.disableSort) return;

		const currentSortDirection = sortable.sortDirection;
		sortables.map((sortable) => (sortable.sortDirection = null));

		if (!currentSortDirection) sortable.sortDirection = 'asc';

		if (sortDirection) sortable.sortDirection = sortDirection;

		displayedItemDefs = orderBy(
			displayedItemDefs,
			(itemDef) => itemDef[sortable.sortKey],
			sortable.sortDirection
		);

		sortables = [...sortables];
	};

	$: sorted = sortables.find((sortable) => !!sortable.sortDirection);

	export const handleChangeFilterField = (event: Event) => {
		event.stopPropagation();
		const inputElement = event.target as HTMLInputElement;

		filter(inputElement.value);
	};

	export const handleClickColumnHeader = (event: MouseEvent, sortable: Sortable) => {
		event.stopPropagation();
		sort(sortable, sortable.sortDirection === 'desc' ? 'asc' : 'desc');
	};

	const idSortable = sortables.find((sortable) => sortable.sortKey === '_id');
	sort(idSortable, 'asc');
</script>

<div class="items-filter-container">
	<input
		class="items-filter"
		placeholder="Filter by name"
		on:input={(e) => handleChangeFilterField(e)}
	/>
</div>

<table class="items-table">
	<thead>
		<tr class="items-table-header-row">
			{#each sortables as sortable}
				<th
					class="items-table-column-header"
					class:no-sort={sortable.disableSort}
					on:click={(e) => handleClickColumnHeader(e, sortable)}
				>
					<span>
						{sortable.label}
					</span>
					{#if sortable.sortDirection}
						<span>{sortable.sortDirection === 'asc' ? '▲' : '▼'}</span>
					{/if}
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each displayedItemDefs as itemDef}
			<tr
				class="items-table-row"
				class:items-table-row-selected={selected === itemDef}
				on:click={(e) => {
					e.stopPropagation();
					selected = itemDef;
				}}
			>
				<td><img src={itemDef.icon} on:dragstart={() => false} /></td>
				<td>{itemDef._id}</td>
				<td>{itemDef.name}</td>
				<td>{itemDef.description}</td>
				<td>{itemDef.cost}</td>
			</tr>
		{/each}
		<tr />
	</tbody>
</table>

<style lang="scss">
	.items-filter-container {
		position: sticky;
		top: 0;
		background: white;
		z-index: 10;
		border-bottom: 1px solid rgba(black, 0.15);
		padding: 1rem;
		margin-bottom: 1rem;
	}

	.items-filter {
		padding: 0.5rem;
		width: 300px;
	}

	.items-table {
		width: 100%;
		border-spacing: 0px;

		.items-table-column-header {
			user-select: none;

			&:not(.no-sort) {
				cursor: pointer;
			}
		}

		.items-table-header-row {
			position: sticky;
			top: 68px;
			height: 48px;
			background: white;
			z-index: 10;
		}

		.items-table-row {
			img {
				user-select: none;
			}

			&:not(.items-table-row-selected) {
				cursor: pointer;
			}

			&.items-table-row-selected {
				background: rgba(skyblue, 0.25);
			}
		}

		td {
			text-align: center;
		}
	}
</style>
