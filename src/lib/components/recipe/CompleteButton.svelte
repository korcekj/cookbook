<script lang="ts">
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	export { className as class };
	export let slug: string;
	export let btnClass = '';
	export let badgeClass = '';

	let className = '';
	let completed = 0;

	$: onSubmit = async () => {
		try {
			completed += 1;
			const response = await fetch(`/api/recipes/${slug}/completed`, {
				method: 'POST'
			});
			if (!response.ok)
				throw new Error(`${response.url} ${response.status} (${response.statusText})`);
		} catch (err) {
			completed -= 1;
			console.error(err);
		}
	};

	onMount(async () => {
		try {
			const response = await fetch(`/api/recipes/${slug}/completed`);
			if (!response.ok)
				throw new Error(`${response.url} ${response.status} (${response.statusText})`);
			({ completed } = await response.json());
		} catch (err) {
			console.error(err);
		}
	});
</script>

<form on:submit|preventDefault={onSubmit} class={twMerge('w-full', className)}>
	<div class="join w-full">
		<button type="submit" class={twMerge('join-item btn', btnClass)}>
			<slot {completed}>{completed}</slot></button
		>
		<span class={twMerge('join-item btn no-animation pointer-events-none', badgeClass)}
			><slot name="badge" {completed}>{completed}</slot></span
		>
	</div>
</form>
