<script lang="ts">
	import { orderBy, cloneDeep, filter as _filter } from 'lodash-es';
	import type { ItemDef } from 'src/interfaces/item-defs';

	type ItemDefSortKey = keyof ItemDef;
	type SortDirection = 'asc' | 'desc';

	interface Sortable {
		name: string;
		label: string;
		sortKey?: ItemDefSortKey;
		sortDirection?: SortDirection;
		disableSort?: boolean;
	}
	interface Sorted {
		sortKey: ItemDefSortKey;
		direction: SortDirection;
	}

	export let clientVersion: string;
	export let itemDefs: ItemDef[];

	let _defs: ItemDef[] = cloneDeep(itemDefs);

	export let sortables: Sortable[] = [
		{
			name: 'icon',
			label: 'Icon',
			disableSort: true
		},
		{
			name: 'id',
			label: 'ID',
			sortKey: '_id'
		},
		{
			name: 'name',
			label: 'Name',
			sortKey: 'name'
		},
		{
			name: 'description',
			label: 'Description',
			sortKey: 'description'
		},
		{
			name: 'cost',
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
		displayedItemDefs = _filter(_defs, (itemDef) =>
			itemDef.name.toLowerCase().includes(filterValue.toLowerCase())
		);

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

<div class="items-table-host">
	<div class="items-table-header">
		<input
			class="filter-input items-filter"
			placeholder="Filter by name"
			on:input={(e) => handleChangeFilterField(e)}
		/>

		<div class="client-version">
			<strong>Client Version: </strong>
			<span>{clientVersion}</span>
		</div>
	</div>

	<div class="items-table">
		<div class="items-table-row items-table-header-row">
			{#each sortables as sortable}
				<div
					class={`items-table-column-header cell-${sortable.name}`}
					class:no-sort={sortable.disableSort}
					on:click={(e) => handleClickColumnHeader(e, sortable)}
				>
					<div class="items-table-column-header-content">
						<span>
							{sortable.label}
						</span>
						{#if sortable.sortDirection}
							<span>{sortable.sortDirection === 'asc' ? '▲' : '▼'}</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
		<div class="items-table-body">
			{#each displayedItemDefs as itemDef}
				<div class="items-table-row" class:items-table-row-selected={selected === itemDef}>
					<div class="items-table-cell cell-icon">
						<img
							src={itemDef.icon}
							on:dragstart={() => false}
							alt={itemDef.name}
							title={itemDef.name}
							class="cell-icon-image"
						/>
					</div>
					<div class="items-table-cell cell-id">{itemDef._id}</div>
					<div class="items-table-cell cell-name">{itemDef.name}</div>
					<div class="items-table-cell cell-descripton">{itemDef.description}</div>
					<div class="items-table-cell cell-cost">{itemDef.cost}</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.items-table-host {
		// max-width: 1200px;
		// margin: 0 auto;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.items-table-header {
		// position: sticky;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		// top: var(--header-height);
		background: white;
		z-index: 10;
		border-bottom: 1px solid rgba(black, 0.15);
		padding: 1rem;
		// margin-bottom: 1rem;
	}

	.items-table-body {
		padding: 0.5rem 0;
	}

	.items-filter {
		width: 300px;
	}

	.items-table {
		display: flex;
		flex-direction: column;
		width: 100%;
		border-spacing: 0px;
		overflow: auto;

		.items-table-column-header {
			flex: 1;
			display: flex;
			justify-content: center;
			align-self: stretch;
			user-select: none;

			&:not(.no-sort) {
				cursor: pointer;
			}

			.items-table-column-header-content {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.items-table-header-row {
			display: flex;
			align-items: center;
			position: sticky;
			top: 0px;
			font-weight: bold;
			display: flex;
			min-height: 54px;
			background: white;
			z-index: 11;
			border-bottom: 1px solid rgba(black, 0.15);
		}

		.items-table-row {
			display: flex;
			padding: 0 1rem;
			// grid-template-columns: 48px repeat(4, s1fr);

			img {
				user-select: none;
			}

			&:not(.items-table-row-selected) {
				// cursor: pointer;
			}

			&.items-table-row-selected {
				background: rgba(skyblue, 0.25);
			}
		}

		.items-table-cell {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.cell-icon-image {
			min-width: 48px;
			min-height: 48px;
			max-width: 48px;
			max-height: 48px;
		}

		.cell-icon {
			display: flex;
			align-items: center;
			flex: 0 0 8%;
			// max-width: 48px;
		}

		.cell-id {
			flex: 0 0 8%;
			// max-width: 200px;
		}

		.cell-name {
			flex: 0 0 20%;
		}

		.cell-cost {
			max-width: 175px;
		}

		td {
			text-align: center;
		}
	}
</style>
