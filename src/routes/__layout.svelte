<script lang="ts">
	import Header from '$lib/components/Header.svelte';
</script>

<Header />

<slot />

<style lang="scss">
	:global {
		@import '../lib/styles/styles.scss';
	}
</style>
