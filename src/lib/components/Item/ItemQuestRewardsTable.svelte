<script lang="ts">
	import type { Quest } from 'src/interfaces/quest';
	import Table from '../Table/Table.svelte';

	export let itemId: number;
	export let quests: Quest[];
</script>

<Table
	columns={[
		{
			label: 'Name',
			key: 'name',
			sort: true,
			slot: true
		},
		{
			label: 'Reward Amount',
			key: 'reward',
			slot: true,
			sort: true,
			sortFn: (row) => row.reward.items.find((i) => i.itemId === itemId)?.amt
		}
	]}
	sticky
	data={quests}
	class="hsh-quest-rewards-table"
	let:key
	let:row
>
	{#if key === 'name'}
		<span class="hsh-quest-rewards-quest-name">{row[key]}</span>
	{/if}
	{#if key === 'reward'}
		{row.reward.items.find((i) => i.itemId === itemId)?.amt}
	{/if}
</Table>

<style lang="scss">
	.hsh-quest-rewards-quest-name {
		font-weight: bold;
		color: turquoise;
	}
</style>
