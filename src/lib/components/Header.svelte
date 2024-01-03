<script lang="ts">
	import type { Category } from '$lib/types';

	import { onMount } from 'svelte';
	import capitalize from 'lodash/capitalize';

	import Dropdown from './Dropdown.svelte';
	import { Search } from 'lucide-svelte';

	let categories: Category[] = [];

	onMount(async () => {
		try {
			const response = await fetch('/api/categories?sort=-recipes');
			if (!response.ok)
				throw new Error(`${response.url} ${response.status} (${response.statusText})`);

			categories = await response.json();
		} catch (err) {
			console.error(err);
		}
	});
</script>

<div
	class="navbar flex-col items-start sm:flex-row sm:items-center bg-gradient-to-r from-base-100 to-base-300 rounded-b-lg px-4"
>
	<div class="flex-1 p-2 sm:p-0">
		<a href="/" class="flex items-center space-x-2">
			<img class="w-10 aspect-square" src="/favicon.png" alt="Logo" />
			<span class="text-3xl text-primary dark:text-neutral-content font-light"
				>Cook<span class="font-bold">Book</span></span
			>
		</a>
	</div>
	<div class="flex-none print:hidden">
		<div class="flex items-center">
			<a href="/#search" class="btn btn-sm btn-ghost font-medium">
				<Search class="w-4 h-4" />
				<span>Hľadaj</span></a
			>
			<Dropdown
				class="btn-ghost btn-sm font-medium"
				contentClass="min-w-max"
				items={categories.map(({ title }) => title)}
			>
				<svelte:fragment slot="select">Kategórie</svelte:fragment>
				<svelte:fragment slot="item" let:index>
					<a href={`/categories/${categories[index].slug}/1`}>
						{capitalize(categories[index].title)}
						<span class="badge badge-sm badge-neutral">{categories[index].recipes}</span>
					</a>
				</svelte:fragment>
			</Dropdown>
		</div>
	</div>
</div>
