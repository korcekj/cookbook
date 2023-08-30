<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	import { Hash } from 'lucide-svelte';

	export let name: string;
	export let titleClass = '';
	export { className as class };

	let className = '';
</script>

<div class={twMerge('flex items-center space-x-1 rounded-lg py-2 px-4', className)}>
	<Hash class="w-4 h-4" />
	<a href={`#${name}`}>
		<h2 class={twMerge('pointer-events-none text-2xl', titleClass)}>
			<slot name="title"
				><span class="font-bold"><slot name="title-bold" /> </span><span class="font-light">
					<slot name="title-light" />
				</span></slot
			>
		</h2>
	</a>
</div>

<div id={name}>
	<slot />
</div>
