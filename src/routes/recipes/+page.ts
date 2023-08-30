import { redirect } from '@sveltejs/kit';

export async function load({ url: { search } }) {
	throw redirect(301, `/recipes/1${search}`);
}
