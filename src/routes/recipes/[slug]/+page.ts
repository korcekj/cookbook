import type { RecipeFile, Recipe } from '$lib/types';

import { slugify } from '$lib/utils';
import { error } from '@sveltejs/kit';
import { CARDS_PER_CAROUSEL as limit } from '$lib/constants';

export async function load({ fetch, params: { slug } }) {
	try {
		const { default: component } = (await import(`../../../recipes/${slug}.md`)) as RecipeFile;
		const recipe = await fetch(`/api/recipes/${slug}`).then<Recipe>((r) => r.json());
		const categories = recipe.categories.join(',');
		const recipes = fetch(`/api/categories/${categories}?sort=-date&limit=${limit}`).then<Recipe[]>(
			(r) => r.json()
		);

		return {
			meta: recipe,
			component,
			recipes
		};
	} catch (err) {
		console.error(err);
		throw error(404, `Recept ${slug} nebol nájdený`);
	}
}
