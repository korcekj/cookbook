import { redirect } from '@sveltejs/kit';
import { getCategories } from '$lib/utils/recipes';

export async function load({ params: { slug } }) {
	throw redirect(301, `/categories/${slug}/1`);
}

export const entries = async () => {
	const categories = getCategories();
	return categories.map(({ slug }) => ({ slug }));
};
