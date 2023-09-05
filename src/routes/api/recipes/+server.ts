import { json } from '@sveltejs/kit';
import { cacheAge } from '$lib/config';
import { getRecipes, sortRecipes } from '$lib/utils/recipes';

export const prerender = false;

export const GET = ({ url, setHeaders }) => {
	const limit = url.searchParams.get('limit');
	const offset = url.searchParams.get('offset');
	const sort = url.searchParams.get('sort');
	const sorter = sort ? sortRecipes(sort) : undefined;

	setHeaders({
		'cache-control': `public, s-maxage=${cacheAge}`
	});

	const recipes = getRecipes();
	return json(
		recipes
			.sort(sorter)
			.slice(Number(offset) || 0, Number(limit) + Number(offset) || recipes.length)
	);
};
