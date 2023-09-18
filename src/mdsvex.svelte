<script context="module" lang="ts">
	import { ol, ul, li } from '$lib/components/custom';
	export { ol, ul, li };
</script>

<script lang="ts">
	import { page } from '$app/stores';

	import CompleteButton from '$lib/components/recipe/CompleteButton.svelte';
	import { StarHalf } from 'lucide-svelte';

	$: ({ slug } = $page.params);
</script>

<slot />

<CompleteButton
	{slug}
	class="w-full pt-6"
	btnClass="btn-block btn-primary"
	badgeClass="btn-square btn-accent"
>
	<svelte:fragment
		><StarHalf class="w-4 h-4 " />Navarené / Napečené<StarHalf
			class="w-4 h-4 transform -scale-x-100"
		/></svelte:fragment
	>
</CompleteButton>
