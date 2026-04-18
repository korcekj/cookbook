import type { Recipe } from '$lib/types';

import { RECIPES_PER_PAGE, CARDS_PER_CAROUSEL } from '$lib/constants';

export async function load({ fetch }) {
	const [latestRecipes, fastestRecipes] = await Promise.all([
		fetch(`/api/recipes?sort=-date&limit=${CARDS_PER_CAROUSEL}`).then<Recipe[]>((r) => r.json()),
		fetch(`/api/recipes?sort=duration&limit=${RECIPES_PER_PAGE}`).then<Recipe[]>((r) => r.json())
	]);

	return { latestRecipes, fastestRecipes };
}
