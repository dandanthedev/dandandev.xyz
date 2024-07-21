<script>
	export let passToComponent;
</script>

<p>
	{#if passToComponent.allowHTML}
		{@html passToComponent.text || ''}
	{:else}
		{passToComponent.text || ''}
	{/if}
</p>

{#if passToComponent.button}
	<button on:click={passToComponent.button.action} class="button"
		>{passToComponent.button.text}</button
	>
{/if}

<style>
	p {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.button {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		border: none;
		border-radius: 5px;
		padding: 10px;
		background-color: #0078d4;
		color: white;
		cursor: pointer;
	}
</style>
