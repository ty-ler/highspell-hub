<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;
	export let icon: string;

	if (!href.startsWith('/')) href = ['/', href].join('');

	$: path = $page.url.pathname;
	$: isActive = path === href || path.includes(`${href}/`);
</script>

<a {...$$props} {href} class={`header-item ${$$props.class}`} class:active={isActive}>
	{#if icon}
		<i class={`header-item-icon ${icon}`} />
	{/if}
	<slot />
</a>

<style lang="scss">
	.header-item {
		font-size: 1rem;
		text-decoration: none;
		color: lighten(black, 35%);

		&.active {
			color: black;
			font-weight: bold;
		}

		.header-item-icon {
			margin-right: 0.25rem;
		}
	}
</style>
