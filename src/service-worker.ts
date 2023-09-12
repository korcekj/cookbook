/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files // everything in `static`
];

sw.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
		await sw.skipWaiting();
	}

	event.waitUntil(addFilesToCache());
});

sw.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
		await sw.clients.claim();
	}

	event.waitUntil(deleteOldCaches());
});

sw.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	const url = new URL(event.request.url);
	if (event.request.method !== 'GET') return;
	if (!url.protocol.startsWith('http')) return;

	async function respond() {
		const cache = await caches.open(CACHE);
		let cacheMatch = await cache.match(event.request);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname) && cacheMatch) {
			return cacheMatch;
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch {
			// do the same thing twice twice and hope for a different result
			cacheMatch = await cache.match(event.request);
			return cacheMatch ?? new Response('Something went wrong', { status: 408 });
		}
	}

	event.respondWith(respond());
});
