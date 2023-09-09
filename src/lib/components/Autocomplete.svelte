<svelte:options immutable />

<script lang="ts">
	type Item = $$Generic<Record<string, any>>;

	import deburr from 'lodash/deburr';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';

	export let items: Item[] = [];
	export let itemTitle: keyof Item;
	export let itemValue: keyof Item;
	export let selected: Item | null = null;

	let search = '';
	let opened = false;
	let filteredItems: Item[] = [];
	let listElement: HTMLUListElement;

	$: if (!opened) close();
	$: if (selected) search = selected[itemTitle] ?? '';

	$: loading = items.length === 0;
	$: filteredItems = items.filter((item) => {
		return deburr(item[itemValue]).toLowerCase().includes(deburr(search).toLowerCase());
	});

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
		if (!listElement.contains(e.relatedTarget as Node)) {
			selected = search ? selected : null;
			search = selected?.[itemTitle] ?? '';
			close();
		}
	};

	const onSearch = (e: Event) => {
		search = (e.target as HTMLInputElement).value ?? '';
	};

	const onSelect = (item: Item) => {
		selected = item;
		close();
	};
</script>

<div class="dropdown dropdown-end w-full">
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<label tabindex="0">
		<div class="join w-full">
			{#if $$slots['prepend-icon']}
				<label for="autocomplete" class="btn btn-square join-item"
					><slot name="prepend-icon" /></label
				>
			{/if}
			<div class="flex relative w-full items-center justify-end">
				<input
					id="autocomplete"
					autocomplete="off"
					type="text"
					class="input input-bordered flex-1 join-item"
					disabled={loading}
					value={search}
					on:input={onSearch}
					on:blur={onBlur}
					on:click={() => {
						if (!opened) opened = true;
					}}
					{...$$restProps}
				/>
				{#if loading}
					<span class="absolute mx-3 loading loading-spinner loading-sm" />
				{/if}
			</div>
			{#if $$slots['append-icon']}
				<label for="autocomplete" class="btn btn-square join-item"
					><slot name="append-icon" /></label
				>
			{/if}
		</div>
	</label>
	{#if search}
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<ul
			tabindex="0"
			class="dropdown-content z-[100] menu p-2 shadow bg-base-100 rounded-box mt-1 min-w-full max-h-80 flex-nowrap overflow-y-auto"
			on:focus={() => (opened = true)}
			bind:this={listElement}
		>
			{#if filteredItems.length}
				{#each filteredItems as item}
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
						<slot name="item" {item}><div tabindex="0" role="button">{item[itemTitle]}</div></slot>
					</li>
				{/each}
			{:else}
				<li class="p-2">
					<slot name="no-items">No data available</slot>
				</li>
			{/if}
		</ul>
	{/if}
</div>
