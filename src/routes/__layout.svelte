<script lang="ts">
	import Header from '$lib/components/Header/Header.svelte';
</script>

<Header />
<div class="main-content-container">
	<slot />
</div>

<style lang="scss">
	:global {
		@import '../lib/styles/styles.scss';

		.main-content-container {
			// display: flex;
			// justify-content: center;
			overflow: auto;
			height: 100%;
			width: 100%;
		}

		.main-content {
			width: 100%;
			height: 100%;
			max-width: var(--app-width);
			padding: 1rem;
			margin: 0 auto;
		}
	}
</style>
