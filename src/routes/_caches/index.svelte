<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ fetch }) => {
		const cacheVersions = await (await fetch('/api/caches')).json();

		return {
			props: {
				cacheVersions
			}
		};
	};
</script>

<script lang="ts">
	export let cacheVersions: string[];
</script>

<div class="caches-host">
	<div class="header">Caches</div>

	{#each cacheVersions as version}
		<div class="cache-link-container">
			<a href={`caches/${version}`} class="cache-link">{version}</a>
		</div>
	{/each}
</div>

<style lang="scss">
	.caches-host {
		max-width: 1500px;
		margin: 0 auto;
		padding: 1rem;

		.header {
			font-size: 2.5rem;
			font-weight: 600;
			margin-bottom: 1rem;
		}

		.cache-link-container {
			&:not(:first-child) {
				margin-top: 0.25rem;
			}

			.cache-link {
			}
		}
	}
</style>
