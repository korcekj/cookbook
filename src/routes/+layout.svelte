<script lang="ts">
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { viewTransition } from '$lib/utils';
	import { onNavigate } from '$app/navigation';

	import '@fontsource/kanit/200.css';
	import '@fontsource/kanit/300.css';
	import '@fontsource/kanit/400.css';
	import '@fontsource/kanit/500.css';
	import '@fontsource/kanit/700.css';

	import '../app.css';

	import Header from '$lib/components/Header.svelte';

	onNavigate(viewTransition);
	inject({ mode: dev ? 'development' : 'production' });
</script>

<Header />

<slot />
