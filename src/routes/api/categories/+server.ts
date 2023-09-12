import { json } from '@sveltejs/kit';
import { cacheAge } from '$lib/config';
import { getCategories, sortCategories } from '$lib/utils/recipes';

export const prerender = false;

export const GET = ({ url, setHeaders }) => {
	const limit = url.searchParams.get('limit');
	const offset = url.searchParams.get('offset');
	const sort = url.searchParams.get('sort');
	const sorter = sort ? sortCategories(sort) : undefined;

	const categories = getCategories();

	setHeaders({
		'cache-control': `public, s-maxage=${cacheAge}`
	});

	return json(
		categories
			.sort(sorter)
			.slice(Number(offset) || 0, Number(limit) + Number(offset) || categories.length)
	);
};
