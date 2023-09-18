import { Redis } from '@upstash/redis';
import { building } from '$app/environment';
import { Ratelimit } from '@upstash/ratelimit';
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from '$env/static/private';

let redis: Redis;
let ratelimit: Ratelimit;

if (!building) {
	redis = new Redis({
		url: UPSTASH_REDIS_REST_URL,
		token: UPSTASH_REDIS_REST_TOKEN
	});

	ratelimit = new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(1, '5 s'),
		prefix: 'ratelimit:recipes',
		analytics: true
	});
}

export { redis, ratelimit };
