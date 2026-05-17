<script>
	export let passToComponent;
</script>

<div class="text {passToComponent.allowHTML ? 'html' : 'pre'}">
	{#if passToComponent.allowHTML}
		{@html passToComponent.text || ''}
	{:else}
		{passToComponent.text || ''}
	{/if}
</div>

{#if passToComponent.buttons?.length > 0}
	<div class="buttons">
		{#each passToComponent.buttons as button}
			<button on:click={button.action} class="button">{button.text}</button>
		{/each}
	</div>
{/if}

<style>
	.text {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		padding-top: 1rem;
	}

	.text.pre {
		white-space: pre-wrap;
		word-wrap: break-word;
		overflow-wrap: anywhere;
	}

	.text.html {
		white-space: normal;
	}

	.buttons {
		display: flex;
		justify-content: flex-start;
		gap: 10px;
		margin-top: 1rem;
		flex-wrap: wrap;
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
