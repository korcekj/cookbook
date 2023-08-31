<script>
	let checked = false;
</script>

<li class:opacity-50={checked}>
	<label>
		<p class="leading-relaxed">
			<slot />
		</p>
		<input type="checkbox" class="hidden" bind:checked />
	</label>
</li>
