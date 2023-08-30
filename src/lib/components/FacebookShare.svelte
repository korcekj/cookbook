<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	import { Facebook } from 'lucide-svelte';

	export let url: string;
	export { className as class };

	let className = '';
</script>

<a
	class={twMerge('btn btn-circle border-none bg-[#3b5998] hover:bg-[#2d4373]', className)}
	href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
	target="_blank"
	rel="noopener"
>
	<Facebook class="w-6 h-6" />
</a>
