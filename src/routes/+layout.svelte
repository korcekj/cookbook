<script lang="ts">
	import '@fontsource/kanit/200.css';
	import '@fontsource/kanit/300.css';
	import '@fontsource/kanit/400.css';
	import '@fontsource/kanit/500.css';
	import '@fontsource/kanit/700.css';

	import '../app.css';

	import Header from '$lib/components/Header.svelte';
	import ViewTransition from '$lib/components/ViewTransition.svelte';
</script>

<ViewTransition />
<Header />

<slot />
