import type { RecipeFile, Recipe } from '$lib/types';

import { slugify } from '$lib/utils';
import { error } from '@sveltejs/kit';

export async function load({ fetch, params: { slug } }) {
	try {
		const recipe = (await import(`../../../recipes/${slug}.md`)) as RecipeFile;
		const categories = recipe.metadata.categories.join('+');
		const recipes = fetch(`/api/categories/${slugify(categories)}?sort=-date&limit=8`).then<
			Recipe[]
		>((r) => r.json());

		return {
			meta: {
				slug,
				...recipe.metadata
			} satisfies Recipe,
			component: recipe.default,
			recipes
		};
	} catch (err) {
		console.error(err);
		throw error(404, `Recept ${slug} nebol nájdený`);
	}
}
