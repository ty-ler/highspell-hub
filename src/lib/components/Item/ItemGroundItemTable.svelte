<script lang="ts">
	import type { GroundItem } from 'src/interfaces/game/ground-items';
	import Table from '../Table/Table.svelte';

	export let groundItems: GroundItem[];
</script>

<Table
	columns={[
		{
			label: 'Amount',
			key: 'amount',
			sort: true
		},
		{
			label: 'x',
			key: 'x',
			sort: true
		},
		{
			label: 'y',
			key: 'y',
			sort: true
		},
		{
			label: 'Map Level',
			key: 'mapLevel',
			sort: true
		},
		{
			label: 'Respawn Ticks',
			key: 'respawnTicks',
			sort: true
		}
	]}
	sticky
	filterKeys={['amount']}
	data={groundItems}
	class="hsh-ground-items-table"
/>
