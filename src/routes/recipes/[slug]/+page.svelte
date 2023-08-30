<script lang="ts">
	import capitalize from 'lodash/capitalize';
	import dayjs from '$lib/utils/date.js';
	import { slugify, url } from '$lib/utils';
	import { scrollToHash } from '$lib/utils/actions.js';
	import { afterNavigate } from '$app/navigation';
	import { PUBLIC_BASE_URL } from '$env/static/public';

	import Section from '$lib/components/Section.svelte';
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import OverlayCard from '$lib/components/OverlayCard.svelte';
	import RecipeServings from '$lib/components/RecipeServings.svelte';
	import MailShare from '$lib/components/MailShare.svelte';
	import FacebookShare from '$lib/components/FacebookShare.svelte';
	import WhatsappShare from '$lib/components/WhatsappShare.svelte';
	import { Printer, ChevronLeft, Timer, ChefHat } from 'lucide-svelte';

	export let data;

	let prev = '/';

	$: ({ meta, component, recipes } = data);
	$: otherRecipes = recipes.filter(({ title }) => title !== meta.title);

	afterNavigate(({ from }) => {
		if (from) prev = from.url.pathname + from.url.search;
	});
</script>

<svelte:head>
	<title>CookBook | {meta.title}</title>
	<meta name="description" content={meta.description} />
	<meta property="og:title" content={`CookBook | ${meta.title}`} />
	<meta property="og:description" content={meta.description} />
	<meta property="og:image" content={url(`${PUBLIC_BASE_URL}/${meta.poster}`)} />
</svelte:head>

<div class="container mx-auto p-6" use:scrollToHash>
	<figure class="relative flex max-h-80 overflow-hidden rounded-box">
		<a href={prev} class="absolute top-4 left-4 btn btn-sm sm:btn-md glass btn-square print:hidden"
			><ChevronLeft class="w-6 h-6" /></a
		>
		<div class="absolute top-4 right-4 flex items-center space-x-2">
			<MailShare
				class="btn-sm sm:btn-md"
				url={url(`${PUBLIC_BASE_URL}/recipes/${meta.slug}`)}
				subject={meta.description}
			/>
			<FacebookShare
				class="btn-sm sm:btn-md"
				url={url(`${PUBLIC_BASE_URL}/recipes/${meta.slug}`)}
			/>
			<WhatsappShare
				class="btn-sm sm:btn-md"
				url={url(`${PUBLIC_BASE_URL}/recipes/${meta.slug}`)}
				text={meta.description}
			/>
			<button
				class="btn btn-sm sm:btn-md glass btn-circle print:hidden"
				on:click={() => window.print()}
			>
				<Printer class="w-6 h-6" />
			</button>
		</div>
		<img src={meta.poster} alt={meta.title} class="aspect-video object-cover" />
	</figure>
	<div class="carousel max-w-full space-x-2 mt-6">
		{#if meta.preparation}
			<div class="carousel-item">
				<div class="badge badge-lg badge-info gap-1">
					<Timer class="w-4 h-4" />{dayjs.duration(meta.preparation, 'minutes').humanize()}
				</div>
			</div>
		{/if}
		{#if meta.cooking}
			<div class="carousel-item">
				<div class="badge badge-lg badge-info gap-1">
					<ChefHat class="w-4 h-4" />{dayjs.duration(meta.cooking, 'minutes').humanize()}
				</div>
			</div>
		{/if}
		<div class="carousel-item">
			<RecipeServings {...meta.servings} class="badge-lg" />
		</div>
		{#each meta.categories as category}
			<div class="carousel-item">
				<a
					href={`/categories/${slugify(category)}/1`}
					class="badge badge-lg badge-ghost hover:badge-outline">{category}</a
				>
			</div>
		{/each}
	</div>
	<article class="prose my-6 max-w-full"><svelte:component this={component} /></article>
	<aside class="print:hidden">
		<Section name="other-recipes" class="bg-gradient-to-r from-base-300 to-base-100">
			<svelte:fragment slot="title-bold">Ďalšie</svelte:fragment>
			<svelte:fragment slot="title-light">recepty</svelte:fragment>
			<div class="carousel max-w-full rounded-box my-6 space-x-4">
				{#each otherRecipes as recipe, i (recipe.slug)}
					<div class="carousel-item w-[85%] max-w-xs xl:max-w-sm">
						{#if i === otherRecipes.length - 1}
							{@const category = recipe.categories[0]}
							<OverlayCard src={recipe.poster} class="min-h-[20rem]">
								<svelte:fragment slot="title">{capitalize(category)}</svelte:fragment>
								<svelte:fragment slot="subtitle">Zobraziť všetky recepty na stránke</svelte:fragment
								>
								<svelte:fragment slot="actions"
									><a href={`/categories/${slugify(category)}/1`} class="btn btn-sm btn-secondary"
										>Všetky recepty</a
									></svelte:fragment
								>
							</OverlayCard>
						{:else}
							<RecipeCard {recipe} />
						{/if}
					</div>
				{/each}
			</div>
		</Section>
	</aside>
</div>
