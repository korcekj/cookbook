import { json } from '@sveltejs/kit';
import { redis, ratelimit } from '$lib/server/redis';

export const prerender = false;

export const POST = async ({ params: { slug }, getClientAddress, setHeaders }) => {
	const ip = getClientAddress();
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

	const completed = await redis.hincrby(`recipe:${slug}`, 'completed', 1);
	return json({ completed });
};

export const GET = async ({ params: { slug } }) => {
	const completed = await redis.hget<number>(`recipe:${slug}`, 'completed');
	return json({ completed: completed ?? 0 });
};
