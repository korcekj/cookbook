<svelte:options immutable />

<script lang="ts">
	type Item = $$Generic<string>;

	import { goto } from '$app/navigation';
	import { twMerge } from 'tailwind-merge';
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';

	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	export let items: Item[] = [];
	export let selected: Item | null = null;
	export let placeholder = '';
	export let contentClass = '';
	export { className as class };

	let opened = false;
	let className = '';
	let listElement: HTMLUListElement | null = null;

	$: if (!opened) close();
	$: loading = items.length === 0;

	$: dispatch('select', selected);

	const dispatch = createEventDispatcher<{
		select: Item | null;
	}>();

	const close = () => {
		if (!browser) return;

		opened = false;
		(document.activeElement as HTMLElement | null)?.blur();
	};

	const onBlur = (e: FocusEvent) => {
		if (!listElement?.contains(e.relatedTarget as Node)) {
			close();
		}
	};

	const onSelect = (item: Item) => {
		selected = item;
		close();
	};
</script>

<div class="dropdown dropdown-end w-full">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
	<label
		tabindex="0"
		role="button"
		class={twMerge('btn btn-block justify-between', className)}
		class:btn-disabled={loading}
		on:blur={onBlur}
		on:click={() => (opened = !opened)}
	>
		{#if loading}<span class="loading loading-spinner loading-xs" />{/if}
		<slot name="select" {selected}>
			{selected ?? placeholder}
		</slot>
		{#if opened}
			<ChevronUp class="w-4 h-4" />
		{:else}
			<ChevronDown class="w-4 h-4" />
		{/if}
		<input type="hidden" value={selected} {...$$restProps} />
	</label>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<ul
		tabindex="0"
		class={twMerge(
			'dropdown-content z-[100] menu p-2 shadow bg-base-100 min-w-full max-h-60 rounded-box mt-1 flex-nowrap overflow-y-auto',
			contentClass
		)}
		on:focus={() => (opened = true)}
		bind:this={listElement}
	>
		{#each items as item, index}
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<li
				class="rounded-lg"
				on:click={() => onSelect(item)}
				on:keydown={(e) => {
					if (e.key === 'Enter') {
						if (e.target instanceof HTMLAnchorElement && e.target.href) goto(e.target.href);
						else onSelect(item);
					}
				}}
			>
				<slot name="item" {item} {index} active={selected === item}
					><div tabindex="0" role="button" class:active={selected === item}>{item}</div></slot
				>
			</li>
		{/each}
	</ul>
</div>
