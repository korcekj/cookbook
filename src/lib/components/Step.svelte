<script>
	import { twMerge } from 'tailwind-merge';

	export { className as class };

	let className = '';
	let checked = false;
</script>

<li class:opacity-50={checked} class={twMerge(className)}>
	<label class="w-full">
		<p class="leading-relaxed">
			<slot />
		</p>
		<input type="checkbox" class="hidden" bind:checked />
	</label>
</li>
