<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import type { ItemInformation } from '../api/item/[itemId]';
	export const load: Load = async ({ fetch, params, url }) => {
		const { itemId } = params;
		const baseApiUrl = `${url.origin}/api`;
		const item = await (await fetch(`${baseApiUrl}/item/${itemId}`)).json();

		if (item.error)
			return {
				redirect: '/',
				status: 302
			};

		return {
			props: {
				item
			}
		};
	};
</script>

<script lang="ts">
	import ItemGroundItemTable from '$lib/components/Item/ItemGroundItemTable.svelte';
	import ItemNpcLootTable from '$lib/components/Item/ItemNpcLootTable.svelte';
	import ItemQuestRewardsTable from '$lib/components/Item/ItemQuestRewardsTable.svelte';
	import { generateItemDefNode } from '$lib/common/graph/graph';

	export let item: ItemInformation;

	console.log(item);

	console.log(generateItemDefNode(item.itemDef));
</script>

<div class="main-content">
	<div class="item-host">
		<div class="item-header">
			<div class="item-header-icon">
				<img src={item.itemDef.icon} alt={item.itemDef.name} />
			</div>
			<div class="item-header-title">
				<div class="item-header-name">{item.itemDef.name}</div>
				<div class="item-header-description">{item.itemDef.description}</div>
			</div>
		</div>

		<div class="item-content">
			{#if item?.quests?.length > 0}
				<div class="item-content-card">
					<div class="item-content-card-header">Quest Rewards</div>
					<ItemQuestRewardsTable itemId={item.itemDef._id} quests={item.quests} />
				</div>
			{/if}
			{#if item?.npcLootTables?.length > 0}
				<div class="item-content-card">
					<div class="item-content-card-header">NPC Drops</div>
					<div class="item-content-card-content">
						<ItemNpcLootTable itemId={item.itemDef._id} npcLootTables={item.npcLootTables} />
					</div>
				</div>
			{/if}
			{#if item?.groundItems?.length > 0}
				<div class="item-content-card">
					<div class="item-content-card-header">Ground Items</div>
					<div class="item-content-card-content">
						<ItemGroundItemTable groundItems={item.groundItems} />
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.item-host {
		display: flex;
		flex-direction: column;
		gap: 2rem;

		:global(.hsh-table) {
			max-height: 500px;
			overflow: auto;
		}
	}

	.item-header {
		display: flex;
		align-items: center;
		gap: 1rem;

		.item-header-title {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;

			.item-header-name {
				font-size: 1.35rem;
				font-weight: bold;
			}
		}
	}

	.item-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;

		.item-content-card {
			display: flex;
			flex-direction: column;
			gap: 1rem;

			.item-content-card-header {
				font-size: 1.35rem;
				font-weight: bold;
			}

			.item-content-card-content {
			}
		}
	}
</style>
