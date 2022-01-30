<script lang="ts">
	import HeaderItem from './HeaderItem.svelte';
</script>

<div class="header">
	<div class="brand" />
	<div class="nav">
		<HeaderItem href="/" icon="fas fa-home">Home</HeaderItem>
		<HeaderItem href="caches" icon="fas fa-history">Caches</HeaderItem>
	</div>
</div>

<style lang="scss">
	:global(:root) {
		--header-height: 51px;
	}

	.header {
		--border-size: 1px;
		--corrected-header-height: calc(var(--header-height) - var(--border-size));

		display: flex;
		align-items: center;
		position: sticky;
		top: 0;
		padding: 0 1rem;
		min-height: var(--corrected-header-height);
		max-height: var(--corrected-header-height);
		background: darken(white, 5%);
		border-bottom: var(--border-size) solid rgba(black, 0.15);

		.nav {
			align-self: stretch;
			display: flex;
			align-items: center;
			gap: 1rem;

			:global {
				.header-item {
					display: flex;
					align-items: center;
					height: 100%;
				}
			}
		}
	}
</style>
