import { CACHE_AGE } from '$lib/constants';
import { json, error } from '@sveltejs/kit';
import { getRecipes } from '$lib/utils/recipes';

export const GET = async ({ params: { slug }, setHeaders }) => {
	setHeaders({
		'cache-control': `public, s-maxage=${CACHE_AGE}`
	});

	const recipe = getRecipes().find((recipe) => recipe.slug === slug);
	if (!recipe) throw error(404, `Recept ${slug} nebol nájdený`);

	return json(recipe);
};
