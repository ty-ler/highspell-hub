<script lang="ts">
	import HeaderItem from './HeaderItem.svelte';
	import { faHome, faHistory, faMap, faMapMarked, faList } from '@fortawesome/free-solid-svg-icons';
	import { isProduction } from '$lib/utils/env';

	export const prod = isProduction();
</script>

<div class="header">
	<div class="header-content">
		<div class="brand" />
		<div class="nav">
			<HeaderItem href="items" icon={faList}>Items</HeaderItem>
			<HeaderItem href="map" icon={faMapMarked}>Map</HeaderItem>
			<!-- <HeaderItem href="caches" icon={faHistory}>Caches</HeaderItem> -->
		</div>
	</div>
</div>

<style lang="scss">
	:global(:root) {
		--header-height-initial: 51px;
		--header-border-size: 1px;
		--header-height: calc(var(--header-height-initial) - var(--header-border-size));
	}

	.header {
		display: flex;
		justify-content: center;
		position: fixed;
		top: 0;
		padding: 0 1rem;
		width: 100%;
		min-height: var(--header-height);
		max-height: var(--header-height);
		// background: darken(white, 5%);
		background: var(--surface-100);
		border-bottom: var(--border-size) solid rgba(black, 0.15);
		z-index: 1000;

		.header-content {
			display: flex;
			align-items: center;
			max-width: var(--app-width);
			width: 100%;
		}

		.nav {
			align-self: stretch;
			display: flex;
			align-items: center;
			gap: 1rem;
			width: 100%;

			:global {
				.header-item {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 100%;
				}
			}
		}
	}
</style>
