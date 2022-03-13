<script lang="ts">
	import { orderBy } from 'lodash-es';
	import { createEventDispatcher } from 'svelte';
	import InputText from '../InputText/InputText.svelte';

	interface TableColumn {
		label: string;
		key: string;
		slot?: boolean;
		sort?: boolean;
		sortFn?: (row: any) => any;
		className?: string;
		align?: 'left' | 'right';
	}

	type TableSortDirection = 'asc' | 'desc';

	export let columns: TableColumn[];
	export let data: any[] = [];
	export let sticky: boolean = false;
	export let stickyTop: string = '0px';
	export let centerColumns: boolean = true;
	export let canHover: boolean = true;
	export let canClickRow: boolean = false;
	export let canSelectRow: boolean = false;
	export let hrefFn: (row: any) => string = null;
	export let showRowDivider: boolean = true;

	export let showFilter: boolean = false;
	export let filterKeys: string[] = [];
	export let filterPlaceholder: string = 'Filter';

	let sortedColumn: TableColumn;
	let sortedColumnDirection: TableSortDirection;
	let displayedData: any[];
	let selected: any;

	let _filterValue: string;
	let _filterTimeout: ReturnType<typeof setTimeout>;

	let dispatch = createEventDispatcher();

	$: {
		displayedData = data;
	}

	const sort = (column: TableColumn, sortDirection?: TableSortDirection) => {
		if (!column.sort) return;

		if (!sortDirection) {
			if (sortedColumn !== column) {
				sortedColumn = column;
				sortedColumnDirection = null;
			}

			if (!sortedColumnDirection) {
				sortedColumnDirection = 'asc';
			} else {
				sortedColumnDirection = sortedColumnDirection === 'asc' ? 'desc' : 'asc';
			}
		}

		displayedData = orderBy(
			displayedData,
			column.sortFn ? (row) => column.sortFn(row) : (row) => row[column.key],
			sortedColumnDirection
		);
	};

	const filter = (filterValue: string) => {
		filterValue = filterValue.toLowerCase();

		if (!filterKeys || filterKeys.length === 0) return;

		if (!filterValue) {
			displayedData = data;
		} else {
			displayedData = data.filter((d) => {
				const ret = filterKeys.map((key) => {
					let value = d[key];
					switch (typeof value) {
						case 'number':
							return value.toString().includes(filterValue);
						case 'string':
							return value?.toLowerCase().includes(filterValue);
						default:
							return false;
					}
				});

				return ret.includes(true);
			});
		}

		if (sortedColumn) sort(sortedColumn, sortedColumnDirection);
	};

	export const handleClickColumnHeader = (event: MouseEvent, column: TableColumn) => {
		event.stopPropagation();
		sort(column);
	};

	export const handleClickRow = (event: MouseEvent, row: any) => {
		if (canSelectRow) {
			if (row === selected) {
				selected = null;
			} else {
				selected = row;
			}
		}

		dispatch('rowClicked', {
			event,
			row
		});
	};

	export const handleFilterValueChanged = (filterValue: string) => {
		filterValue = filterValue;
		clearTimeout(_filterTimeout);

		if (!filterValue) {
			filter(filterValue);
			return;
		}

		_filterTimeout = setTimeout(() => {
			filter(filterValue);
		}, 250);
	};
</script>

<div class="hsh-table-host">
	{#if showFilter}
		<div class="hsh-table-filter">
			<InputText
				value={_filterValue}
				placeholder={filterPlaceholder}
				showClear
				class="hsh-table-filter-input"
				on:valueChanged={({ detail }) => handleFilterValueChanged(detail.value)}
			/>
		</div>
	{/if}
	<div {...$$restProps} class={`hsh-table ${$$props.class}`}>
		<div
			class="hsh-table-row hsh-table-header-row"
			class:hsh-table-header-row-sticky={sticky}
			style:--hsh-table-header-row-sticky-top={stickyTop}
		>
			{#each columns as column}
				<div
					class="hsh-table-column hsh-table-column-header 
						{centerColumns ? 'hsh-table-column-center' : ''}
						{column.key ? `hsh-table-column-${column.key}` : ''}
						{column.align ? `hsh-table-column-align-${column.align}` : ''}
					"
					class:no-sort={!column.sort}
					on:click={(e) => handleClickColumnHeader(e, column)}
				>
					<div class="hsh-table-column-header-content">
						<span>{column.label}</span>
						{#if column === sortedColumn}
							<span class="hsh-table-column-sort-dir"
								>{sortedColumnDirection === 'asc' ? '▲' : '▼'}</span
							>
						{/if}
					</div>
				</div>
			{/each}
		</div>
		<div class="hsh-table-body">
			{#each displayedData as row}
				<a
					href={hrefFn ? hrefFn(row) : null}
					class="
					hsh-table-row
					{canHover ? 'hsh-table-row-hover' : ''}
					{canClickRow ? 'hsh-table-row-click' : ''}
					{canSelectRow ? 'hsh-table-row-select' : ''}
					{canSelectRow && row === selected ? 'hsh-table-row-selected' : ''}
					{showRowDivider ? 'hsh-table-row-divider' : ''}
				"
					on:click={(e) => handleClickRow(e, row)}
				>
					{#each columns as column}
						<div
							class="hsh-table-column hsh-table-cell 
								{centerColumns ? 'hsh-table-column-center ' : ''}
							 	{column.key ? `hsh-table-column-${column.key} ` : ''}
								{column.align ? `hsh-table-column-align-${column.align}` : ''}
							 "
						>
							{#if !column.slot}
								{row[column.key]}
							{:else}
								<slot key={column.key} {row} {column} />
							{/if}
						</div>
					{/each}
				</a>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	@import '../../styles/vars.scss';

	.hsh-table-host {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	.hsh-table {
		display: flex;
		flex-direction: column;
		width: 100%;
		border-spacing: 0px;

		--hsh-table-hover: var(--surface-50);
		--hsh-table-selected: var(--surface-100);

		.hsh-table-body {
			// padding: 0.5rem 0;
		}

		.hsh-table-column {
			flex: 1;
			display: flex;
			align-items: center;

			&.hsh-table-column-align-left {
				justify-content: flex-start;
				text-align: left;
			}

			&.hsh-table-column-align-right {
				justify-content: flex-end;
				text-align: right;
			}

			&.hsh-table-column-center {
				justify-content: center;
				text-align: center;
			}
		}

		.hsh-table-column-header {
			align-self: stretch;
			user-select: none;

			&:not(.no-sort) {
				cursor: pointer;
			}

			.hsh-table-column-header-content {
				display: flex;
				justify-content: center;
				align-items: center;
				gap: 0.25rem;

				.hsh-table-column-sort-dir {
					// transform: scale(0.75);
					font-size: 0.75rem;
				}
			}
		}

		.hsh-table-header-row {
			display: flex;
			align-items: center;
			font-weight: bold;
			display: flex;
			min-height: 54px;
			z-index: 11;
			border-bottom: 1px solid rgba(black, 0.15);
			background: var(--surface-100);

			&.hsh-table-header-row-sticky {
				position: sticky;
				top: var(--hsh-table-header-row-sticky-top);
			}
		}

		.hsh-table-row {
			display: flex;
			padding: 0 1rem;
			min-height: 48px;
			text-decoration: none;

			&.hsh-table-row-divider {
				border-bottom: 1px solid var(--surface-100);
			}

			&.hsh-table-row-hover {
				&:hover {
					background: var(--hsh-table-hover);
				}
			}

			&.hsh-table-row-click,
			&.hsh-table-row-select {
				cursor: pointer;
			}

			&.hsh-table-row-select {
				&.hsh-table-row-selected {
					background: var(--hsh-table-selected);
				}
			}
		}
	}
</style>
