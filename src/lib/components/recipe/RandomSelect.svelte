<script lang="ts">
	import type { Recipe } from '$lib/types';

	import capitalize from 'lodash/capitalize';
	import { createRandomStore } from '$lib/stores/random';
	import { occasionCategory } from '$lib/utils/recipes';

	import Modal from '../Modal.svelte';
	import RecipeCard from './Card.svelte';
	import Dropdown from '../Dropdown.svelte';
	import { Dices, Cookie } from 'lucide-svelte';

	let recipes: Recipe[] = [];
	let occasion: string | null = null;

	$: if (occasion) fetchRecipes();

	const recipe = createRandomStore<Recipe>();

	const fetchRecipes = async () => {
		try {
			const response = await fetch(`/api/occasions/${occasion}/recipes`);
			if (!response.ok)
				throw new Error(`${response.url} ${response.status} (${response.statusText})`);

			recipe.set(await response.json());
		} catch (err) {
			console.error(err);
		}
	};

	const fetchCommonRecipes = async (recipe: Recipe) => {
		try {
			const response = await fetch(
				`/api/categories/${recipe.categories.join(',')}?sort=-date&limit=3`
			);
			if (!response.ok)
				throw new Error(`${response.url} ${response.status} (${response.statusText})`);

			recipes = ((await response.json()) as Recipe[]).filter(({ slug }) => slug !== recipe.slug);
		} catch (err) {
			console.error(err);
		}
	};

	const onRandom = () => {
		recipe.random();
	};

	recipe.subscribe((v) => {
		if (v) fetchCommonRecipes(v);
		else recipes = [];
	});
</script>

<div class="join w-full">
	<Dropdown
		class="btn-primary join-item"
		placeholder="Príležitosť"
		bind:selected={occasion}
		items={Object.keys(occasionCategory)}
	>
		<svelte:fragment slot="item" let:item let:active>
			<button class:active>{capitalize(item)}</button>
		</svelte:fragment>
	</Dropdown>
	<button disabled={!occasion} class="btn btn-square join-item" on:click={onRandom}>
		<Dices class="w-5 h-5" />
	</button>
</div>

<Modal id="modal-recipe" class={recipes.length ? 'max-w-2xl' : 'max-w-md'} open={!!$recipe}>
	<svelte:fragment slot="title"
		><div class="flex items-center gap-x-2">
			<Cookie class="w-6 h-6" /> Mmm.. to je mňamka!
		</div></svelte:fragment
	>
	<svelte:fragment slot="content">
		{#if $recipe}
			<div class="grid grid-cols-1 sm:grid-cols-2 py-4" class:sm:grid-cols-1={!recipes.length}>
				<RecipeCard recipe={$recipe} />
				{#if recipes.length}
					<div class="flex flex-col sm:flex-row">
						<div class="divider sm:divider-horizontal">
							<button class="btn btn-square btn-sm" on:click={onRandom}
								><Dices class="w-4 h-4" /></button
							>
						</div>
						<div class="carousel w-full rounded-box sm:mt-6 space-x-4">
							{#each recipes as recipe}
								<div class="carousel-item w-[85%]">
									<RecipeCard {recipe} />
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</svelte:fragment>
</Modal>
