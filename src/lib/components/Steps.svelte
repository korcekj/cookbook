<script>
	import { twMerge } from 'tailwind-merge';

	export { className as class };

	let className = '';
</script>

<ol role="list" class={twMerge('stepper not-prose', className)}>
	<slot />
</ol>
