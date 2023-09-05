import { json } from '@sveltejs/kit';
import { slugify } from '$lib/utils';
import { cacheAge } from '$lib/config';
import { getRecipes, sortRecipes } from '$lib/utils/recipes';

export const prerender = false;

export const GET = ({ url, setHeaders, params: { category } }) => {
	const limit = url.searchParams.get('limit');
	const offset = url.searchParams.get('offset');
	const sort = url.searchParams.get('sort');
	const sorter = sort ? sortRecipes(sort) : undefined;

	let recipes = getRecipes();
	recipes = recipes.filter(({ categories }) =>
		// Multiple categories are joined with a plus sign
		categories.some((c) => category.split('+').includes(slugify(c)))
	);

	setHeaders({
		'cache-control': `public, s-maxage=${cacheAge}`
	});

	return json(
		recipes
			.sort(sorter)
			.slice(Number(offset) || 0, Number(limit) + Number(offset) || recipes.length)
	);
};
