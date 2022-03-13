<script lang="ts">
	import { faTimes } from '@fortawesome/free-solid-svg-icons';

	import { createEventDispatcher } from 'svelte';
	import Button from '../Button/Button.svelte';

	export let value: string = '';
	export let placeholder: string;
	export let passwordField: boolean = false;
	export let showClear: boolean = false;
	export let disableFocusBorder: boolean = false;

	const dispatch = createEventDispatcher();
	const dispatchValue = () => {
		dispatch('valueChanged', { value });
	};

	const handleInput = (e: Event) => {
		const inputElement = e.target as HTMLInputElement;
		value = inputElement.value;
		dispatchValue();
	};

	export const handleClickClearButton = (e: MouseEvent) => {
		value = '';
		dispatchValue();
	};
</script>

<div class="hsc-text-input-host">
	<input
		{...$$restProps}
		class={`hsh-text-input ${$$props.class}`}
		class:hsh-text-input-disable-focus-border={disableFocusBorder}
		{placeholder}
		type={passwordField ? 'password' : 'text'}
		{value}
		on:input={(e) => handleInput(e)}
		on:input
	/>
	{#if showClear && value}
		<Button
			icon={faTimes}
			rounded
			transparent
			class="hsh-text-input-clear-button"
			on:click={(e) => handleClickClearButton(e)}
		/>
	{/if}
</div>

<style global lang="scss">
	@import '../../styles/vars.scss';

	.hsc-text-input-host {
		display: inline-flex;
		align-items: center;
		position: relative;

		.hsh-text-input {
			box-sizing: border-box;
			padding-right: 2rem;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;

			&.hsh-text-input-disable-focus-border {
				border-color: transparent !important;
			}
		}

		.hsh-text-input-clear-button {
			position: absolute;
			right: 0;
		}
	}

	.hsh-text-input {
		border-radius: 4px;
		padding: 0.75rem 0.5rem;
		background: var(--surface-100);
		color: var(--text-color);

		&:disabled {
			background: var(--surface-50);

			&::placeholder {
				opacity: 0.5;
			}
		}

		&::placeholder {
			color: var(--text-color-secondary);
		}

		border: 1px solid var(--surface-200);
		transition: all 0.2s ease 0s;
		outline: none;

		&:focus {
			border-color: var(--color-primary);
		}
	}
</style>
