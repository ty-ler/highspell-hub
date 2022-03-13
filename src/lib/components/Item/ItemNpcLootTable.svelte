<script lang="ts">
	import { max } from 'lodash-es';

	import type { NpcLootTable } from 'src/interfaces/npc-loot';
	import Table from '../Table/Table.svelte';

	export let itemId: number;
	export let npcLootTables: NpcLootTable[];

	let amounts = new Map<number, number[]>();

	$: {
		amounts.clear();
		npcLootTables.forEach((t) => {
			const loot = [...(t?.baseLoot ?? []), ...(t?.loot ?? [])];
			const lootAmounts = loot
				.filter((l) => l.itemId === itemId)
				.map((l) => l.amount)
				.sort((a, b) => a - b);

			amounts.set(t._id, lootAmounts);
		});
	}
</script>

<Table
	columns={[
		{
			label: 'Name',
			key: 'npc',
			sort: true,
			slot: true
		},
		{
			label: 'Amount',
			key: 'amount',
			slot: true,
			sort: true,
			sortFn: (row) => {
				const maxAmount = Math.max(...amounts.get(row._id));
				return !isNaN(maxAmount) ? maxAmount : null;
			}
		}
	]}
	sticky
	data={npcLootTables}
	class="hsh-npc-loot-table"
	let:key
	let:row
>
	{#if key === 'npc'}
		<span class="hsh-npc-loot-table-npc-name">{row[key]}</span>
	{/if}
	{#if key === 'amount'}
		{amounts.get(row._id)?.join(', ')}
	{/if}
</Table>

<style lang="scss">
	.hsh-npc-loot-table-npc-name {
		color: rgb(221, 221, 2);
		font-weight: bold;
	}
</style>
