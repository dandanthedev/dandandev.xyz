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

{#if passToComponent.buttons?.length > 0}
	{#each passToComponent.buttons as button}
		<button on:click={button.action} class="button">{button.text}</button>
	{/each}
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
		margin-right: 10px;
	}
</style>
