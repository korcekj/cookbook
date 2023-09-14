<script lang="ts">
	import type { Recipe } from '$lib/types';

	import dayjs from '$lib/utils/date';
	import { slugify } from '$lib/utils';
	import { twMerge } from 'tailwind-merge';
	import { afterNavigate } from '$app/navigation';

	import RecipeServings from './Servings.svelte';
	import { Clock } from 'lucide-svelte';

	export let recipe: Recipe;
	export { className as class };

	let className = '';
	let navigated = false;

	const beforeNavigate = () => {
		navigated = true;
	};

	afterNavigate(() => {
		navigated = false;
	});
</script>

<div class={twMerge('card card-compact card-bordered border-base-200 w-full', className)}>
	<figure class="relative" class:motion-safe:[view-transition-name:figure]={navigated}>
		<span class="absolute top-4 left-4 btn btn-xs pointer-events-none z-[1]">
			<Clock class="w-4 h-4" />
			{dayjs.duration(recipe.preparation + recipe.cooking, 'minutes').humanize()}
		</span>
		<a href={`/recipes/${recipe.slug}`} on:click={beforeNavigate}
			><img
				src={recipe.poster}
				alt={recipe.title}
				class="aspect-video object-cover hover:blur-[1px]"
			/></a
		>
	</figure>
	<div class="card-body">
		<h2 class="card-title">{recipe.title}</h2>
		<div class="carousel space-x-1">
			<div class="carousel-item">
				<RecipeServings {...recipe.servings} />
			</div>
			{#each recipe.categories as category}
				<div class="carousel-item">
					<a href={`/categories/${slugify(category)}/1`}
						><div class="badge badge-ghost hover:badge-outline">{category}</div></a
					>
				</div>
			{/each}
		</div>
		<p class="line-clamp-3">{recipe.description}</p>
		<div class="card-actions justify-end">
			<a class="btn btn-secondary btn-sm" href={`/recipes/${recipe.slug}`} on:click={beforeNavigate}
				>Detaily receptu</a
			>
		</div>
	</div>
</div>
