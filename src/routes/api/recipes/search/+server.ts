import { json } from '@sveltejs/kit';
import { CACHE_AGE } from '$lib/constants';
import { getRecipes, searchRecipes } from '$lib/utils/recipes';

const recipes = getRecipes();
const search = searchRecipes(recipes);

export const prerender = false;

export const GET = async ({ url, setHeaders }) => {
	const q = url.searchParams.get('q') ?? '';

	setHeaders({
		'cache-control': `public, s-maxage=${CACHE_AGE}`
	});

	const results = search(q);

	return json(results);
};
