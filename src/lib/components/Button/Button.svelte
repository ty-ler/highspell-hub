<script lang="ts">
	import type { UIElementColor } from '$lib/common/ui';

	import Fa from 'svelte-fa';

	export let label: string = null;
	export let icon: any = null;
	export let color: UIElementColor = null;
	export let transparent: boolean = false;
	export let rounded: boolean = false;
	export let outlined: boolean = false;
	export let disabled: boolean = false;
</script>

<button
	{...$$restProps}
	type={$$props.type || 'button'}
	{disabled}
	class="
		hsh-button 
		{color && !transparent ? 'hsh-button-' + color : ''} 
		{transparent ? 'hsh-button-transparent' : ''}
		{rounded ? 'hsh-button-rounded' : ''}
		{outlined ? 'hsh-button-outlined' : ''}
		{icon && !label ? 'hsh-button-icon-only' : ''}
		{$$restProps.class || ''}
	"
	class:hsh-button-disabled={disabled}
	on:click
>
	{#if icon}
		<Fa {icon} />
	{/if}
	{#if label}
		<span class="hcs-button-label">{label}</span>
	{/if}
</button>

<style global lang="scss">
	.hsh-button {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		padding: 0 0.75rem;
		min-width: 2.15rem;
		min-height: 2.15rem;
		background: var(--color-info);
		border-radius: var(--border-radius);
		cursor: pointer;
		user-select: none;

		transition: background 0.2s ease 0ms;

		&:hover {
			background: var(--color-info-hover);
		}

		&.hsh-button-icon-only {
			padding: 0;
		}

		&.hsh-button-transparent {
			background: transparent;
		}

		&.hsh-button-primary {
			background: var(--color-primary);

			&.hsh-button-outlined {
				border-color: var(--color-primary);
			}
		}

		&.hsh-button-info {
			background: var(--color-info);

			&.hsh-button-outlined {
				border-color: var(--color-info);
			}
		}

		&.hsh-button-success {
			background: var(--color-success);

			&.hsh-button-outlined {
				border-color: var(--color-success);
			}
		}

		&.hsh-button-warn {
			background: var(--color-warn);

			&.hsh-button-outlined {
				border-color: var(--color-warn);
			}
		}

		&.hsh-button-danger {
			background: var(--color-danger);

			&.hsh-button-outlined {
				border-color: var(--color-danger);
			}
		}

		&.hsh-button-rounded {
			border-radius: var(--border-radius);

			&.hsh-button-icon-only {
				border-radius: 50%;
			}
		}

		&.hsh-button-outlined {
			background: transparent;
			border: 1px solid rgba(white, 0.35);
		}

		&.hsh-button-disabled {
			// background: rgba(white, .01);
			opacity: 0.5;
			pointer-events: none;
			user-select: none;
		}
	}
</style>
