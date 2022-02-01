<script lang="ts">
	import Header from '$lib/components/Header.svelte';
</script>

<Header />
<div class="main-content-container">
	<div class="main-content">
		<slot />
	</div>
</div>

<style lang="scss">
	:global {
		@import '../lib/styles/styles.scss';
	}
</style>
