<script>
	import { draggable } from '@neodrag/svelte';
	import Fa from 'svelte-fa';
	import {
		faMinus,
		faXmark,
		faUpRightAndDownLeftFromCenter,
		faDownLeftAndUpRightToCenter
	} from '@fortawesome/free-solid-svg-icons';
	import { scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { getScreenSize } from '$lib/utils.js';

	export let id;
	export let windows = [];
	export let title = 'Window';
	export let initialWidth = 500;
	export let initialHeight = 200;
	export let initialX = 0;
	export let initialY = 0;
	export let debug = false;
	export let getNextZIndex;
	export let toastWrapper;
	export let focus;

	export let currentlyFocused = false;

	//just to make sure no random linking jazz happens
	let width = parseInt(initialWidth);
	let height = parseInt(initialHeight);
	let x = parseInt(initialX);
	let y = parseInt(initialY);

	let fullscreen = false;

	export let zIndex;

	let hidden = false;

	let wBack = width;
	let hBack = height;

	$: if (focus) {
		if (!hidden) {
			hidden = true;
		} else {
			zIndex = getNextZIndex();
			hidden = false;
			focus = false;
		}
	}

	onMount(() => {
		zIndex = getNextZIndex();
	});

	$: if (debug) console.log(width, height, x, y);
</script>

<div
	on:focus={() => {
		currentlyFocused = true;
		console.log('focus');
	}}
	on:blur={() => {
		currentlyFocused = false;
		console.log('blur');
	}}
	use:draggable={{
		handle: '.header',
		position: {
			x: x,
			y: y
		},
		onDrag: (e) => {
			if (e.offsetX === 0 && e.offsetY === 0) return; //prevents going out of fullscreen while going in
			if (fullscreen) {
				if (debug) console.log('going out of fullscreen');
				fullscreen = false;
				width = wBack;
				height = hBack;
			}
		}
	}}
	class="window"
	style="width: {width}px; height: {height}px; left: {x}px; top: {y}px; z-index: {zIndex}; opacity: {hidden
		? 0
		: 1}; pointer-events: {hidden ? 'none' : 'auto'};"
	in:scale={{ duration: 200, start: 0.9, opacity: 0 }}
	out:scale={{ duration: 200, start: 0.9, opacity: 0 }}
	on:mousedown={() => {
		zIndex = getNextZIndex();
	}}
	on:touchstart={() => {
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
			on:click={() => {
				hidden = true;
			}}
		>
			<Fa icon={faMinus} />
		</button>
		<button
			class="icon"
			on:click={() => {
				if (fullscreen) {
					if (debug) console.log('going out of fullscreen');
					fullscreen = false;
					width = wBack;
					height = hBack;
				} else {
					if (debug) console.log('going into fullscreen');
					fullscreen = true;
					wBack = width;
					hBack = height;
					const { screenW, screenH } = getScreenSize();

					width = screenW - 20;
					height = screenH - 14;

					x = 0;
					y = 0;
				}
			}}
		>
			{#if fullscreen}
				<Fa icon={faDownLeftAndUpRightToCenter} />
			{:else}
				<Fa icon={faUpRightAndDownLeftFromCenter} />
			{/if}
		</button>
		<button
			class="icon"
			on:click={async () => {
				hidden = true;
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

<style>
	.window {
		position: fixed;
		background-color: white;
		padding: 10px;
		border-radius: 5px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

		resize: both;
		overflow: hidden;

		transition: opacity 0.3s;
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
