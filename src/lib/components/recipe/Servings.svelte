<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	import { Utensils, CakeSlice } from 'lucide-svelte';

	export let unit: string;
	export let count: number;
	export { className as class };

	let className = '';
</script>

<div class={twMerge('badge badge-warning gap-1', className)}>
	{#if unit === 'portions'}
		<Utensils class="w-4 h-4" />
	{:else if unit === 'pieces'}
		<CakeSlice class="w-4 h-4" />
	{/if}
	{count}
</div>
