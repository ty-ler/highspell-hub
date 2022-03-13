<script lang="ts">
	import type { ItemDef } from 'src/interfaces/game/item-defs';
	import Table from '../Table/Table.svelte';

	export let clientVersion: string;
	export let itemDefs: ItemDef[];
</script>

<Table
	columns={[
		{
			key: 'icon',
			label: 'Icon',
			slot: true
		},
		{
			key: '_id',
			label: 'ID',
			sort: true
		},
		{
			key: 'name',
			label: 'Name',
			sort: true
		},
		{
			key: 'description',
			label: 'Description',
			sort: true
		},
		{
			key: 'cost',
			label: 'Cost',
			sort: true
		}
	]}
	sticky
	showFilter
	canClickRow
	canHover
	filterKeys={['name']}
	data={itemDefs}
	hrefFn={(row) => `items/${row._id}`}
	let:key
	let:row
	on:rowClicked={({ detail }) => {
		console.log(detail.row);
	}}
	class="hsh-root-items-table"
>
	{#if key === 'icon'}
		<img
			src={row.icon}
			on:dragstart={() => false}
			alt={row.name}
			title={row.name}
			class="item-icon"
		/>
	{/if}
</Table>

<style lang="scss">
	:global(.hsh-root-items-table .item-icon) {
		min-width: 48px;
		min-height: 48px;
		max-width: 48px;
		max-height: 48px;
	}

	:global(.hsh-root-items-table .hsh-table-column-icon) {
		display: flex !important;
		align-items: center !important;
		flex: 0 0 8% !important;
	}

	:global(.hsh-root-items-table .hsh-table-column-_id) {
		flex: 0 0 8% !important;
		// max-width: 200px;
	}

	:global(.hsh-root-items-table .hsh-table-column-name) {
		flex: 0 0 20% !important;
	}

	.hsh-table-column-cost {
		max-width: 175px !important;
	}
</style>
