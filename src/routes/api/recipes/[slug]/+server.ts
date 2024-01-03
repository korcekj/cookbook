import { cacheAge } from '$lib/config';
import { json, error } from '@sveltejs/kit';
import { getRecipes } from '$lib/utils/recipes';
import { getCompleted } from '$lib/server/redis';

export const GET = async ({ params: { slug }, setHeaders }) => {
	setHeaders({
		'cache-control': `public, s-maxage=${cacheAge}`
	});

	const recipe = getRecipes().find((recipe) => recipe.slug === slug);
	if (!recipe) throw error(404, `Recept ${slug} nebol nájdený`);

	recipe.completed = await getCompleted(slug);
	return json(recipe);
};
