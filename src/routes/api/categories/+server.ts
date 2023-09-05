import type { Category } from '$lib/types';

import { json } from '@sveltejs/kit';
import { slugify } from '$lib/utils';
import { cacheAge } from '$lib/config';
import { getRecipes, sortCategories } from '$lib/utils/recipes';

export const prerender = false;

export const GET = ({ url, setHeaders }) => {
	const limit = url.searchParams.get('limit');
	const offset = url.searchParams.get('offset');
	const sort = url.searchParams.get('sort');
	const sorter = sort ? sortCategories(sort) : undefined;

	const recipes = getRecipes();

	const categories = recipes.reduce((acc, { categories }) => {
		categories.forEach((category) => {
			const index = acc.findIndex(({ title }) => title === category);
			if (index === -1) acc.push({ title: category, slug: slugify(category), recipes: 1 });
			else acc[index].recipes++;
		});
		return acc;
	}, [] as Category[]);

	setHeaders({
		'cache-control': `public, s-maxage=${cacheAge}`
	});

	return json(
		categories
			.sort(sorter)
			.slice(Number(offset) || 0, Number(limit) + Number(offset) || recipes.length)
	);
};
