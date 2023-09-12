<script lang="ts">
	import type { Recipe } from '$lib/types';

	import { onMount, onDestroy } from 'svelte';

	import Autocomplete from './Autocomplete.svelte';
	import { Search } from 'lucide-svelte';

	let focus = false;
	let timeout: number;
	let recipes: Recipe[] = [];

	const onHashChange = () => {
		focus = location.hash === '#search';
		timeout = setTimeout(() => {
			focus = false;
		}, 100);
	};

	onMount(async () => {
		recipes = await fetch('/api/recipes?sort=title').then<Recipe[]>((res) => res.json());
		onHashChange();
	});

	onDestroy(() => {
		clearTimeout(timeout);
	});
</script>

<svelte:window on:hashchange={onHashChange} />

<Autocomplete
	items={recipes}
	itemTitle="title"
	itemValue="title"
	placeholder="Vyhľadaj recept"
	{focus}
>
	<svelte:fragment slot="prepend-icon"><Search class="w-4 h-4" /></svelte:fragment>
	<svelte:fragment slot="item" let:item>
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
	</svelte:fragment>
	<svelte:fragment slot="no-items">Žiadne výsledky</svelte:fragment>
</Autocomplete>
