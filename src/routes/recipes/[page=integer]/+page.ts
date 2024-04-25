import type { Recipe } from '$lib/types';

import { redirect } from '@sveltejs/kit';
import { isRecipeSort } from '$lib/utils/recipes';
import { RECIPES_PER_PAGE as limit } from '$lib/constants';

export const prerender = false;

export async function load({ fetch, url: { search, searchParams }, params: { page } }) {
	const offset = (Number(page) - 1) * limit;

	let sort = '-date';
	if (isRecipeSort(searchParams.get('sort') ?? '')) sort = searchParams.get('sort')!;

	// limit + 1 to check if there is a next page
	const recipes = await fetch(`/api/recipes?sort=${sort}&limit=${limit + 1}&offset=${offset}`).then<
		Recipe[]
	>((r) => r.json());

	// Check if page exists
	if (!recipes.length) throw redirect(301, '/recipes');

	return {
		recipes: recipes.slice(0, limit),
		sort,
		prev: Number(page) > 1 ? `/recipes/${Number(page) - 1}${search}` : null,
		next: recipes.length > limit ? `/recipes/${Number(page) + 1}${search}` : null
	};
}
