<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	import { MessageCircle } from 'lucide-svelte';

	export let url: string;
	export let text = '';
	export { className as class };

	let className = '';
</script>

<a
	class={twMerge('btn btn-circle border-none bg-[#25D366] hover:bg-[#1da851]', className)}
	href={`whatsapp://send?text=${encodeURIComponent(text)}${encodeURIComponent(
		' '
	)}${encodeURIComponent(url)}`}
	target="_blank"
	rel="noopener"
	aria-label="Share on WhatsApp"
>
	<MessageCircle class="w-6 h-6 text-white" />
</a>
