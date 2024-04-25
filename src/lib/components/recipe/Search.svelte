<script lang="ts">
	import type { Recipe } from '$lib/types';

	import debounce from 'lodash/debounce';
	import { twMerge } from 'tailwind-merge';
	import { onMount, onDestroy } from 'svelte';
	import { DEBOUNCE_MS } from '$lib/constants';
	import { searchRecipes } from '$lib/utils/recipes';

	import { Search } from 'lucide-svelte';

	export { className as class };

	let q = '';
	let open = false;
	let loading = true;
	let className = '';
	let timeout: number;
	let recipes: Recipe[] = [];
	let search: (q: string) => Recipe[];

	let listElement: HTMLUListElement | null = null;

	$: if (!open) close();
	$: if (search) recipes = search(q);

	const close = () => {
		open = false;
		timeout = setTimeout(() => {
			q = '';
		}, DEBOUNCE_MS);
	};

	const onBlur = (e: FocusEvent) => {
		if (!listElement?.contains(e.relatedTarget as Node)) {
			close();
		}
	};

	const onSearch = debounce((e: Event) => {
		q = (e.target as HTMLInputElement).value ?? '';
	}, DEBOUNCE_MS);

	onMount(async () => {
		try {
			const response = await fetch('/api/recipes');
			if (!response.ok)
				throw new Error(`${response.url} ${response.status} (${response.statusText})`);

			const data = await response.json();
			search = searchRecipes(data);
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	});

	onDestroy(() => {
		clearTimeout(timeout);
	});
</script>

<div class="dropdown dropdown-end w-full">
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<label tabindex="0">
		<div class="join w-full">
			<label for="autocomplete" class="btn btn-square join-item"><Search class="w-4 h-4" /></label>
			<div class="flex relative w-full items-center justify-end">
				<input
					id="autocomplete"
					autocomplete="off"
					placeholder="Vyhľadaj recept"
					type="text"
					class={twMerge('input flex-1 join-item', className)}
					disabled={loading}
					value={q}
					on:input={onSearch}
					on:blur={onBlur}
					on:click={() => {
						if (!open) open = true;
					}}
				/>
				{#if loading}
					<label for="autocomplete" class="btn btn-square join-item"
						><span class="absolute mx-3 loading loading-spinner loading-sm" /></label
					>
				{/if}
			</div>
		</div>
	</label>
	{#if q}
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<ul
			tabindex="0"
			class="dropdown-content z-[100] menu p-2 shadow bg-base-100 rounded-box mt-2 min-w-full max-h-80 flex-nowrap overflow-y-auto"
			on:focus={() => (open = true)}
			bind:this={listElement}
		>
			{#if recipes.length}
				{#each recipes as item}
					<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
					<li
						class="rounded-lg"
						on:click={close}
						on:keydown={(e) => {
							if (e.key === 'Enter') close();
						}}
					>
						<a href={`/recipes/${item.slug}`} class="flex items-center space-x-2">
							<img
								class="w-10 h-10 aspect-square object-cover rounded"
								src={item.poster}
								alt={item.title}
							/>
							<div class="flex flex-col">
								<span class="font-medium line-clamp-1">{item.title}</span>
								<span class="font-light line-clamp-1">{item.description}</span>
							</div>
						</a>
					</li>
				{/each}
			{:else}
				<li class="p-2">Žiadne výsledky</li>
			{/if}
		</ul>
	{/if}
</div>
