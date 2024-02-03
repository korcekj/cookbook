import { Redis } from '@upstash/redis';
import { building } from '$app/environment';
import { Ratelimit } from '@upstash/ratelimit';
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from '$env/static/private';

export let redis: Redis;
export let ratelimit: Ratelimit;

if (!building) {
	redis = new Redis({
		url: UPSTASH_REDIS_REST_URL,
		token: UPSTASH_REDIS_REST_TOKEN
	});

	ratelimit = new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(2, '5 s'),
		prefix: 'ratelimit:recipes',
		analytics: true
	});
}

export const getCompleted = async (slug: string) => {
	const [_1, [_2, completed]] = await redis.zscan('recipes', 0, {
		match: slug,
		count: 1
	});

	return completed ? Number(completed) : 0;
};

export const getAllCompleted = () => {
	return redis.zrange<(string | number)[]>('recipes', 0, -1, {
		withScores: true
	});
};

export const incrementCompleted = (slug: string, by = 1) => {
	return redis.zincrby(`recipes`, by, slug);
};
