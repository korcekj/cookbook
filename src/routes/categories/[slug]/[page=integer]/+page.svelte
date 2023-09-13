<script lang="ts">
	import { url } from '$lib/utils';
	import { recipeSorts } from '$lib/utils/recipes';
	import { PUBLIC_BASE_URL } from '$env/static/public';

	import RecipeCard from '$lib/components/recipe/Card.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import SearchRecipe from '$lib/components/recipe/Search.svelte';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	export let data;

	$: ({ recipes, prev, next, sort } = data);
</script>

<svelte:head>
	<title>CookBook | Recepty</title>
	<meta
		name="description"
		content="Neviete sa rozhodnúť čo dnes na obed alebo večeru? Potom je tu pre Vás zoznam našich obľúbených a jednoduchých receptov"
	/>
	<meta property="og:title" content="CookBook | Recepty" />
	<meta
		property="og:description"
		content="Neviete sa rozhodnúť čo dnes na obed alebo večeru? Potom je tu pre Vás zoznam našich obľúbených a jednoduchých receptov"
	/>
	<meta property="og:image" content={url(`${PUBLIC_BASE_URL}/favicon.png`)} />
</svelte:head>

<div class="container mx-auto p-6">
	<div class="flex flex-col md:flex-row gap-6">
		<SearchRecipe />
		<Dropdown items={Object.keys(recipeSorts)} selected={sort}>
			<svelte:fragment slot="select" let:selected
				>{selected ? recipeSorts[selected] : 'Zoradiť podľa'}</svelte:fragment
			>
			<svelte:fragment slot="item" let:item let:active>
				<a href={`1?sort=${item}`} class:active>{recipeSorts[item]}</a>
			</svelte:fragment>
		</Dropdown>
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-6">
		{#each recipes as recipe (recipe.slug)}
			<RecipeCard {recipe} />
		{/each}
	</div>
	<div class="join grid grid-cols-2">
		<a href={prev} class="join-item btn" class:btn-disabled={!prev}
			><ChevronLeft class="w-4 h-4" />Predchádzajúca strana</a
		>
		<a href={next} class="join-item btn" class:btn-disabled={!next}
			>Ďalšia strana <ChevronRight class="w-4 h-4" /></a
		>
	</div>
</div>
