<script>
	let checked = false;

	const onClick = () => {
		checked = !checked;
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<li class:opacity-50={checked} on:click={onClick}>
	<p class="leading-relaxed">
		<slot />
	</p>
</li>
