import { redirect } from '@sveltejs/kit';

export async function load({ params: { slug } }) {
	redirect(301, `/categories/${slug}/1`);
}
