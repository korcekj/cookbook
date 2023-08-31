<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let src: string;
	export { className as class };

	let className = '';
</script>

<div class={twMerge('group card card-compact card-bordered border-base-200 image-full', className)}>
	<figure>
		<img {src} alt="Overlay" class="group-hover:blur-[1px]" />
	</figure>
	<div class="card-body items-center text-center">
		<h2 class="card-title"><slot name="title" /></h2>
		<p class="line-clamp-3"><slot name="subtitle" /></p>
		<div class="card-actions justify-end w-full">
			<slot name="actions" />
		</div>
	</div>
</div>
