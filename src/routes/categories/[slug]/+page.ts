import { redirect } from '@sveltejs/kit';

export async function load({ url: { search }, params: { slug } }) {
	throw redirect(301, `/categories/${slug}/1${search}`);
}
