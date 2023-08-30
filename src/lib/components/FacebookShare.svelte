<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let url: string;
	export { className as class };

	let className = '';
</script>

<a
	class={twMerge('btn btn-circle border-none bg-white hover:bg-white', className)}
	href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
	target="_blank"
	rel="noopener"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		class="fill-[#3b5998] stroke-none hover:fill-[#2d4373] transition-colors"
		><path
			d="M12 0C5.38 0 0 5.38 0 12s5.38 12 12 12 12-5.38 12-12S18.62 0 12 0zm3.6 11.5h-2.1v7h-3v-7h-2v-2h2V8.34c0-1.1.35-2.82 2.65-2.82h2.35v2.3h-1.4c-.25 0-.6.13-.6.66V9.5h2.34l-.24 2z"
		/></svg
	></a
>
