<script lang="ts">
	import Header from '$lib/components/Header/Header.svelte';
	import { onMount } from 'svelte';
	import { disableBodyScroll } from 'body-scroll-lock';

	onMount(() => {
		const mainContentContainer = document.querySelector('.main-content-container');

		if (!mainContentContainer) throw new Error('Failed to get main content container');

		console.log('Disabling body scroll!');
		disableBodyScroll(mainContentContainer);
	});
</script>

<Header />
<div class="main-content-container">
	<slot />
</div>

<style lang="scss">
	:global {
		@import '../lib/styles/styles.scss';

		.main-content-container {
			height: 100%;
			width: 100%;
			overflow: auto;
		}

		.main-content {
			width: 100%;
			// height: 100%;
			max-width: var(--app-width);
			padding: 1rem;
			margin: 0 auto;
		}
	}
</style>
