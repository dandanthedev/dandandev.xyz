<script>
	import { draggable } from '@neodrag/svelte';
	import Fa from 'svelte-fa';
	import { faXmark } from '@fortawesome/free-solid-svg-icons';
	import { scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	export let id;
	export let windows = [];
	export let title = 'Window';
	export let width = 500;
	export let height = 200;
	export let x = 0;
	export let y = 0;
	export let debug = false;
	export let getNextZIndex;
	export let toastWrapper;

	let zIndex;

	let open = false;

	onMount(() => {
		open = true;
		zIndex = getNextZIndex();
	});
</script>

{#if open}
	<div
		use:draggable={{
			handle: '.header'
		}}
		class="window"
		style="width: {width}px; height: {height}px; left: {x}px; top: {y}px; z-index: {zIndex};"
		in:scale={{ duration: 200, start: 0.9, opacity: 0 }}
		out:scale={{ duration: 200, start: 0.9, opacity: 0 }}
		on:mousedown={() => {
			zIndex = getNextZIndex();
		}}
		on:click={() => {
			zIndex = getNextZIndex();
		}}
	>
		<div class="header">
			<h1>{title} {debug ? id : ''}</h1>
		</div>
		<div class="icons">
			<button
				class="icon"
				on:click={async () => {
					open = false;
					await new Promise((r) => setTimeout(r, 201));
					windows = windows.filter((w) => w.id !== id);
					if (debug)
						toastWrapper(`window ${id} closed, new list: ${windows.map((w) => w.id)}`, 'success', {
							icon: '⚠️',
							duration: 2000
						});
				}}
			>
				<Fa icon={faXmark} />
			</button>
		</div>
		<div class="headerSpacer" />
		<slot />
	</div>
{/if}

<style>
	.window {
		position: fixed;
		background-color: white;
		padding: 10px;
		border-radius: 5px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

		resize: both;
		overflow: hidden;
	}

	.header {
		position: absolute;
		top: 0;
		left: 0;
		width: 98%;
		height: 20px;
		background-color: rgb(230, 230, 230);
		padding: 10px;
	}

	.headerSpacer {
		height: 28px;
	}

	h1 {
		font-size: 1.2em;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		margin-top: -5px;
	}

	.icons {
		position: absolute;
		top: 0;
		right: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.icon {
		background-color: transparent;
		border: none;
		font-size: 1.5em;
		color: rgb(100, 100, 100);
		cursor: pointer;
		margin-top: 5px;
	}
</style>
