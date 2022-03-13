<script lang="ts" context="module">
	export const load: Load = async ({ url }) => ({ props: { url } });
</script>

<script lang="ts">
	import Header from '$lib/components/Header/Header.svelte';
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import type { Load } from '@sveltejs/kit';
	import { fullscreenContent } from '$lib/stores/store';

	export let url: string;

	onMount(() => {
		const mainContentContainer = document.querySelector('.main-content-container');

		if (!mainContentContainer) throw new Error('Failed to get main content container');

		// console.log('Disabling body scroll!');
		// disableBodyScroll(mainContentContainer);
	});
</script>

<Header />
<div class="main-content-container" class:main-content-container-fullscreen={$fullscreenContent}>
	<slot />
</div>

<style lang="scss">
	:global {
		@import '../lib/styles/styles.scss';

		.main-content-container {
			height: 100%;
			width: 100%;

			&.main-content-container-fullscreen {
				overflow: hidden;
			}
		}

		.main-content {
			width: 100%;
			height: 100%;
			max-width: var(--app-width);
			padding: 1rem;
			margin: 0 auto;

			&.main-content-fullscreen {
				--main-content-fullscreen-height: calc(100vh - var(--header-height));

				height: var(--main-content-fullscreen-height) !important;
				min-height: -webkit-fill-available !important;
				max-height: -webkit-fill-available !important;
				overflow: hidden !important;
			}
		}

		// Small devices (landscape phones, less than 768px)
		@media (max-width: 767.98px) {
			.main-content {
				padding: 1rem 0.5rem;
			}
		}

		// Safari Only
		@media not all and (min-resolution: 0.001dpcm) {
			@supports (-webkit-appearance: none) and (stroke-color: transparent) {
				.main-content-container {
					max-height: -webkit-fill-available;
				}
			}
		}
	}
</style>
