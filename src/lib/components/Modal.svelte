<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { createEventDispatcher } from 'svelte';

	import { X } from 'lucide-svelte';

	export let id: string;
	export let open = false;
	export { className as class };

	let opened = false;
	let className = '';

	$: if (open) opened = true;
	$: if (!open && opened) dispatch('close');

	const dispatch = createEventDispatcher<{
		close: undefined;
	}>();
</script>

<input type="checkbox" bind:checked={open} {id} class="modal-toggle" />
<div class="modal">
	<div class={twMerge('modal-box', className)}>
		<div class="flex flex-row-reverse">
			<label for={id} class="btn btn-square btn-sm"><X class="w-4 h-4" /></label>
		</div>
		<h3 class="font-bold text-xl"><slot name="title" /></h3>
		<slot name="content">
			<p class="py-4"><slot name="text" /></p>
		</slot>
		{#if $$slots['actions']}
			<div class="modal-action">
				<slot name="actions" />
			</div>
		{/if}
	</div>
	<label class="modal-backdrop" for={id}>Close</label>
</div>
