<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	import { Mail } from 'lucide-svelte';

	export let url: string;
	export let subject = '';
	export { className as class };

	let className = '';
</script>

<a
	class={twMerge('btn btn-circle btn-neutral', className)}
	href={`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(url)}`}
	target="_self"
	rel="noopener"
	aria-label="Share via email"
>
	<Mail class="w-6 h-6" />
</a>
