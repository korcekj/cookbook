<script lang="ts">
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	export { className as class };
	export let slug: string;
	export let btnClass = '';
	export let badgeClass = '';

	let completed = 0;
	let className = '';
	let increment = true;

	$: onSubmit = async () => {
		try {
			completed = increment ? completed + 1 : completed - 1;
			const response = await fetch(`/api/recipes/${slug}/completed?increment=${increment}`, {
				method: 'POST'
			});
			if (!response.ok)
				throw new Error(`${response.url} ${response.status} (${response.statusText})`);

			increment = !increment;
		} catch (err) {
			console.error(err);
			completed = increment ? completed - 1 : completed + 1;
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
