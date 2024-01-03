import { redirect } from '@sveltejs/kit';

export async function load({ params: { slug } }) {
	throw redirect(301, `/categories/${slug}/1`);
}
