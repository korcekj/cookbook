import { json } from '@sveltejs/kit';
import { getCompleted, incrementCompleted, ratelimit } from '$lib/server/redis';

export const prerender = false;

export const POST = async ({ params: { slug }, url, getClientAddress, setHeaders }) => {
	const ip = getClientAddress();
	const increment = url.searchParams.get('increment');

	const { success, reset, remaining, limit } = await ratelimit.limit(ip);
	if (!success) {
		const seconds = Math.floor((reset - new Date().getTime()) / 1000);

		setHeaders({
			'X-RateLimit-Limit': limit.toString(),
			'X-RateLimit-Remaining': remaining.toString(),
			'X-RateLimit-Reset': reset.toString()
		});

		return json(
			{ message: `Too many requests. Please try again in ${seconds} seconds.` },
			{ status: 429 }
		);
	}

	const completed = await incrementCompleted(slug, increment === 'true' ? 1 : -1);

	return json({ completed });
};

export const GET = async ({ params: { slug } }) => {
	const completed = await getCompleted(slug);
	return json({ completed });
};
