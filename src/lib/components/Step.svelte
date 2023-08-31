<script>
	import { twMerge } from 'tailwind-merge';

	export { className as class };

	let className = '';
</script>

<li class={twMerge(className)}>
	<p class="leading-relaxed">
		<slot />
	</p>
</li>
