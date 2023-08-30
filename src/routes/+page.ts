import type { Recipe } from '$lib/types';

export async function load({ fetch }) {
	const latestRecipes = fetch('/api/recipes?sort=-date&limit=8').then<Recipe[]>((r) => r.json());
	const fastestRecipes = fetch('/api/recipes?sort=duration&limit=12').then<Recipe[]>((r) =>
		r.json()
	);
	return { latestRecipes, fastestRecipes };
}
