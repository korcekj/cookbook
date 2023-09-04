<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let asideClass = '';
	export let mainClass = '';
	export let reverse = false;
	export { className as class };

	let className = '';
</script>

<div
	class={twMerge(
		'flex flex-col md:flex-row items-stretch md:items-center p-4 md:p-6 rounded-lg',
		className
	)}
	class:md:flex-row-reverse={reverse}
	class:flex-col-reverse={reverse}
	{...$$restProps}
>
	<div class={twMerge('flex-1 flex flex-col items-center space-y-2', asideClass)}>
		<slot name="aside">
			<span class="font-medium text-xl"><slot name="title" /></span>
			<p class="font-light leading-relaxed text-justify">
				<slot name="text" />
			</p>
		</slot>
	</div>
	<div class="flex-none divider md:divider-horizontal" />
	<div class={twMerge('flex-1 flex', mainClass)}>
		<slot name="main" />
	</div>
</div>
