import { json } from '@sveltejs/kit';
import { CACHE_AGE } from '$lib/constants';
import { getRecipes, sortRecipes } from '$lib/utils/recipes';

export const prerender = false;

export const GET = async ({ url, setHeaders }) => {
	const limit = url.searchParams.get('limit');
	const offset = url.searchParams.get('offset');
	const sort = url.searchParams.get('sort');
	const sorter = sort ? sortRecipes(sort) : undefined;

	setHeaders({
		'cache-control': `public, s-maxage=${CACHE_AGE}`
	});

	const recipes = getRecipes();

	return json(
		recipes
			.sort(sorter)
			.slice(Number(offset) || 0, Number(limit) + Number(offset) || recipes.length)
	);
};
