import type { Recipe } from '$lib/types';

import { recipesPerPage, cardsPerCarousel } from '$lib/config';

export async function load({ fetch }) {
	const latestRecipes = fetch(`/api/recipes?sort=-date&limit=${cardsPerCarousel}`).then<Recipe[]>(
		(r) => r.json()
	);
	const fastestRecipes = fetch(`/api/recipes?sort=duration&limit=${recipesPerPage}`).then<Recipe[]>(
		(r) => r.json()
	);
	return { latestRecipes, fastestRecipes };
}
