<script lang="ts">
	import { url } from '$lib/utils';
	import { scrollToHash } from '$lib/utils/actions.js';
	import { PUBLIC_BASE_URL } from '$env/static/public';

	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import OverlayCard from '$lib/components/OverlayCard.svelte';
	import SearchRecipe from '$lib/components/SearchRecipe.svelte';
	import Section from '$lib/components/Section.svelte';
	import Banner from '$lib/components/Banner.svelte';
	import MailShare from '$lib/components/MailShare.svelte';
	import FacebookShare from '$lib/components/FacebookShare.svelte';
	import WhatsappShare from '$lib/components/WhatsappShare.svelte';

	export let data;

	$: ({ latestRecipes, fastestRecipes } = data);
</script>

<svelte:head>
	<title>CookBook | Online kuchárka</title>
	<meta
		name="description"
		content="Neviete sa rozhodnúť čo dnes na obed alebo večeru? Potom je tu pre Vás zoznam našich obľúbených a jednoduchých receptov"
	/>
	<meta property="og:title" content="CookBook | Online kuchárka" />
	<meta
		property="og:description"
		content="Neviete sa rozhodnúť čo dnes na obed alebo večeru? Potom je tu pre Vás zoznam našich obľúbených a jednoduchých receptov"
	/>
	<meta property="og:image" content={url(`${PUBLIC_BASE_URL}/favicon.png`)} />
</svelte:head>

<div class="container mx-auto p-6" use:scrollToHash>
	<Section name="latest-recipes" class="bg-gradient-to-r from-base-300 to-base-100">
		<svelte:fragment slot="title-bold">Najnovšie</svelte:fragment>
		<svelte:fragment slot="title-light">recepty</svelte:fragment>
		<div class="carousel max-w-full rounded-box my-6 space-x-4">
			{#each latestRecipes as recipe, i (recipe.slug)}
				<div class="carousel-item w-[85%] max-w-xs xl:max-w-sm">
					{#if i === latestRecipes.length - 1}
						<OverlayCard src={recipe.poster} class="min-h-[20rem]">
							<svelte:fragment slot="title">Najnovšie recepty</svelte:fragment>
							<svelte:fragment slot="subtitle">Zobraziť všetky recepty na stránke</svelte:fragment>
							<svelte:fragment slot="actions"
								><a href="/recipes/1?sort=-date" class="btn btn-sm btn-secondary">Všetky recepty</a
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
	<Banner
		id="search-recipe"
		class="bg-gradient-to-r from-primary/60 to-primary mb-6"
		asideClass="text-primary-content"
	>
		<svelte:fragment slot="title">Hľadáte recept?</svelte:fragment>
		<svelte:fragment slot="text"
			>V prípade, že chcete nájsť recept, ktorého názov, poprípade jeho časť poznáte, ale nemáte čas
			si vychutnať všetky recepty tak neváhajte si recept vyhľadať. Stačí zadať kľúčové znaky alebo
			slová do poľa "Vyhľadaj recept". Chutné hľadanie!</svelte:fragment
		>
		<svelte:fragment slot="main">
			<SearchRecipe />
		</svelte:fragment>
	</Banner>
	<Section name="fastest-recipes" class="bg-gradient-to-r from-base-300 to-base-100">
		<svelte:fragment slot="title-bold">Najrýchlejšie</svelte:fragment>
		<svelte:fragment slot="title-light">recepty</svelte:fragment>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-6">
			{#each fastestRecipes as recipe, i (recipe.slug)}
				{#if i === fastestRecipes.length - 1}
					<OverlayCard src={recipe.poster} class="min-h-[20rem]">
						<svelte:fragment slot="title">Najrýchlejšie recepty</svelte:fragment>
						<svelte:fragment slot="subtitle">Zobraziť všetky recepty na stránke</svelte:fragment>
						<svelte:fragment slot="actions"
							><a href="/recipes/1?sort=duration" class="btn btn-sm btn-secondary">Všetky recepty</a
							></svelte:fragment
						>
					</OverlayCard>
				{:else}
					<RecipeCard {recipe} />
				{/if}
			{/each}
		</div>
	</Section>
	<Banner
		reverse
		class="bg-gradient-to-r from-primary/60 to-primary"
		mainClass="items-center justify-center space-x-2"
		asideClass="text-primary-content"
	>
		<svelte:fragment slot="title">Máte chuť recept zdieľať?</svelte:fragment>
		<svelte:fragment slot="text"
			>Pre zdieľanie receptu použite tlačidlá pri detaile receptu v hornej časti obrazovky. Recept
			je možné zdieľať aj prostredníctvom sociálnych sietí, poprípade si ho nechať vytlačiť. Chutné
			zdieľanie!</svelte:fragment
		>
		<svelte:fragment slot="main">
			<FacebookShare class="btn-sm sm:btn-md" url={PUBLIC_BASE_URL} />
			<WhatsappShare
				class="btn-sm sm:btn-md"
				url={PUBLIC_BASE_URL}
				text={'CookBook | Online kuchárka'}
			/>
			<MailShare
				class="btn-sm sm:btn-md"
				url={PUBLIC_BASE_URL}
				subject={'CookBook | Online kuchárka'}
			/>
		</svelte:fragment>
	</Banner>
</div>
