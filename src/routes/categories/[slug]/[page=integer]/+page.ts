import type { Recipe } from '$lib/types';

import { redirect, error } from '@sveltejs/kit';
import { isRecipeSort } from '$lib/utils/recipes';

export const prerender = false;

export async function load({ fetch, url: { search, searchParams }, params: { slug, page } }) {
	const limit = 12;
	const offset = (Number(page) - 1) * limit;

	let sort = '-date';
	if (isRecipeSort(searchParams.get('sort') ?? '')) sort = searchParams.get('sort')!;

	// limit + 1 to check if there is a next page
	const recipes = await fetch(
		`/api/categories/${slug}?sort=${sort}&limit=${limit + 1}&offset=${offset}`
	).then<Recipe[]>((r) => r.json());

	// Check if category exists
	if (!recipes.length && Number(page) === 1) throw error(404, `Kategória ${slug} nebola nájdená`);
	// Check if page exists
	if (!recipes.length) throw redirect(301, '/recipes');

	return {
		recipes: recipes.slice(0, limit),
		sort,
		prev: Number(page) > 1 ? `/categories/${slug}/${Number(page) - 1}${search}` : null,
		next: recipes.length > limit ? `/categories/${slug}/${Number(page) + 1}${search}` : null
	};
}
