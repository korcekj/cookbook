<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { Moon, Sun } from 'lucide-svelte';

	export { className as class };

	let className = '';
	let isActive = false;
	let isLoading = false;
	let supportsWakeLock = false;

	type NoSleepInstance = {
		enable: () => void | Promise<void>;
		disable: () => void;
	};

	let noSleep: NoSleepInstance | null = null;
	/* eslint-disable-next-line no-undef */
	let wakeLock: WakeLockSentinel | null = null;

	async function toggle() {
		if (isLoading) return;

		isLoading = true;
		try {
			if (isActive) {
				await disable();
			} else {
				await enable();
			}
		} finally {
			isLoading = false;
		}
	}

	async function enable() {
		try {
			if (supportsWakeLock) {
				wakeLock = await navigator.wakeLock.request('screen');
				wakeLock.addEventListener('release', () => {
					isActive = false;
				});
			} else if (noSleep) {
				await noSleep.enable();
			}
			isActive = true;
		} catch (err) {
			console.error('Screen wake error:', err);
		}
	}

	async function disable() {
		if (wakeLock) {
			await wakeLock.release();
			wakeLock = null;
		} else if (noSleep) {
			noSleep.disable();
		}
		isActive = false;
	}

	onMount(async () => {
		supportsWakeLock = 'wakeLock' in navigator;

		// Fallback for iOS and other browsers without Wake Lock API support
		if (!supportsWakeLock) {
			try {
				const { default: NoSleep } = await import('nosleep.js');
				noSleep = new NoSleep();
			} catch (err) {
				console.error('Failed to load NoSleep.js:', err);
			}
		}
	});

	onDestroy(() => {
		disable();
	});

	$: title = isActive ? 'Povoliť uspanie obrazovky' : 'Zabrániť uspaniu obrazovky';
</script>

<button
	class={twMerge('btn btn-circle', isActive ? 'btn-warning' : 'btn-info', className)}
	on:click={toggle}
	{title}
	aria-label={title}
	disabled={isLoading}
>
	{#if isActive}
		<Sun class="w-6 h-6" />
	{:else}
		<Moon class="w-6 h-6" />
	{/if}
</button>
