<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="container mx-auto p-6">
	<div class="flex flex-col space-y-2 items-center">
		<h1 class="font-bold text-5xl text-error">{$page.status}</h1>
		<p class="font-light text-xl text-error">{$page.error?.message}</p>
	</div>
</div>
