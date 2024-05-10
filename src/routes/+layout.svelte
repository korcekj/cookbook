<script lang="ts">
	import '@fontsource-variable/rubik';

	import '../app.css';

	import Header from '$lib/components/Header.svelte';
	import ViewTransition from '$lib/components/ViewTransition.svelte';
</script>

<ViewTransition />
<Header />

<slot />
