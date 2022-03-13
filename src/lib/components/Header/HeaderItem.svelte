<script lang="ts">
	import { page } from '$app/stores';
	import Fa from 'svelte-fa/src/fa.svelte';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

	export let href: string;
	export let icon: IconDefinition;

	if (!href.startsWith('/')) href = ['/', href].join('');

	$: path = $page.url.pathname;
	$: isActive = path === href || path.includes(`${href}/`);
</script>

<a {...$$props} {href} class={`header-item ${$$props.class}`} class:active={isActive}>
	{#if icon}
		<Fa {icon} class="header-item-icon" />
	{/if}
	<slot />
</a>

<style lang="scss">
	.header-item {
		font-size: 1rem;
		text-decoration: none;
		color: var(--text-color);
		user-select: none;

		&.active {
			// color: var(--text-color-secondary);
			color: var(--color-primary);
			font-weight: bold;
		}

		:global {
			.header-item-icon {
				margin-right: 0.25rem;
			}
		}
	}
</style>
