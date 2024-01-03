import { json } from '@sveltejs/kit';
import { toPairs } from '$lib/utils';
import { cacheAge } from '$lib/config';
import { getAllCompleted } from '$lib/server/redis';
import { getRecipes, sortRecipes } from '$lib/utils/recipes';

export const prerender = false;

export const GET = async ({ url, setHeaders }) => {
	const limit = url.searchParams.get('limit');
	const offset = url.searchParams.get('offset');
	const sort = url.searchParams.get('sort');
	const sorter = sort ? sortRecipes(sort) : undefined;

	setHeaders({
		'cache-control': `public, s-maxage=${cacheAge}`
	});

	const recipes = getRecipes();

	const completed = toPairs(await getAllCompleted());
	completed.forEach(([slug, completed]) => {
		const i = recipes.findIndex((recipe) => recipe.slug === slug);
		recipes[i].completed = Number(completed);
	});

	return json(
		recipes
			.sort(sorter)
			.slice(Number(offset) || 0, Number(limit) + Number(offset) || recipes.length)
	);
};
