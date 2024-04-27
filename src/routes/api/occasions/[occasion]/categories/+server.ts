import { json } from '@sveltejs/kit';
import { CACHE_AGE } from '$lib/constants';
import { getOccasionCategories, sortCategories } from '$lib/utils/recipes';

export const prerender = false;

export const GET = async ({ params: { occasion }, url, setHeaders }) => {
	const limit = url.searchParams.get('limit');
	const offset = url.searchParams.get('offset');
	const sort = url.searchParams.get('sort');
	const sorter = sort ? sortCategories(sort) : undefined;

	setHeaders({
		'cache-control': `public, s-maxage=${CACHE_AGE}`
	});

	const categories = getOccasionCategories(occasion);

	return json(
		categories
			.sort(sorter)
			.slice(Number(offset) || 0, Number(limit) + Number(offset) || categories.length)
	);
};
