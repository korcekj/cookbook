import { CACHE_AGE } from '$lib/constants';
import { json, error } from '@sveltejs/kit';
import { getCategoryRecipes, occasionCategories, sortRecipes } from '$lib/utils/recipes';

export const prerender = false;

export const GET = async ({ params: { occasion }, url, setHeaders }) => {
	const limit = url.searchParams.get('limit');
	const offset = url.searchParams.get('offset');
	const sort = url.searchParams.get('sort');
	const sorter = sort ? sortRecipes(sort) : undefined;

	setHeaders({
		'cache-control': `public, s-maxage=${CACHE_AGE}`
	});

	if (!occasionCategories.hasOwnProperty(occasion))
		throw error(404, `Príležitosť ${occasion} nebola nájdená`);

	const categories = occasionCategories[occasion as keyof typeof occasionCategories];
	const recipes = getCategoryRecipes(categories.join('+'));

	return json(
		recipes
			.sort(sorter)
			.slice(Number(offset) || 0, Number(limit) + Number(offset) || recipes.length)
	);
};
