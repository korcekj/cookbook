import { json } from '@sveltejs/kit';
import { CACHE_AGE } from '$lib/constants';
import { getCategoryRecipes, sortRecipes } from '$lib/utils/recipes';

export const prerender = false;

export const GET = ({ url, setHeaders, params: { category } }) => {
	const limit = url.searchParams.get('limit');
	const offset = url.searchParams.get('offset');
	const sort = url.searchParams.get('sort');
	const sorter = sort ? sortRecipes(sort) : undefined;

	const recipes = getCategoryRecipes(category);

	setHeaders({
		'cache-control': `public, s-maxage=${CACHE_AGE}`
	});

	return json(
		recipes
			.sort(sorter)
			.slice(Number(offset) || 0, Number(limit) + Number(offset) || recipes.length)
	);
};
