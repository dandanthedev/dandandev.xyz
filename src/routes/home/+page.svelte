<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Explorer from '$lib/Explorer.svelte';
	import Window from '$lib/Window.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import Fa from 'svelte-fa';
	import toast, { Toaster } from 'svelte-french-toast';
	import { preloadedAssets } from '$lib/stores.js';
	import { goto } from '$app/navigation';
	let zindex = 1;
	export function getNextZIndex() {
		zindex++;
		return zindex;
	}

	function toastWrapper(message, type, options) {
		toast[type](message, {
			position: 'bottom-right',
			...options
		});
	}
	export function openWindow(windowData) {
		if (debug) {
			if (!windowData.component) return toastWrapper('No component specified', 'error');
			if (!windowData.title) return toastWrapper('No title specified', 'error');
		}
		let window = windowData.component;

		if (!windowData.width) windowData.width = 400;
		if (!windowData.height) windowData.height = 200;

		const newWindow = {
			component: windowData.component,
			title: windowData.title,
			id: uuidv4(),
			x: Math.floor(Math.random() * (window.innerWidth - windowData.width || 400)),
			y: Math.floor(Math.random() * (window.innerHeight - windowData.height || 200)),
			width: windowData.width,
			height: windowData.height,
			passToComponent: windowData.passToComponent || {}
		};

		if (debug)
			toastWrapper('Opening window: ' + JSON.stringify(newWindow), 'success', {
				icon: '⚠️',
				duration: 5000
			});

		setTimeout(() => {
			openWindows = [...openWindows, newWindow];
		}, 1);
	}

	let overlay = true;
	let debug = false;
	onMount(async () => {
		if ($preloadedAssets.loading) goto('/');
		overlay = false;
	});

	const desktopIcons = [
		{
			icon: $preloadedAssets.explorer,
			text: 'Explorer',
			component: Explorer,
			width: 500,
			height: 600
		},
		{
			icon: $preloadedAssets.debugger,
			text: 'Debugger',
			color: 'red',
			run: () => {
				if (debug) {
					debug = false;
					toastWrapper('Debug mode is disabled', 'success');
				} else {
					debug = true;
					toastWrapper('Debug mode is enabled', 'error', {
						icon: '⚠️'
					});
				}
			}
		}
	];

	desktopIcons.forEach((i) => (i.id = uuidv4()));

	let openWindows = [];
</script>

<span class="toaster">
	<Toaster />
</span>

{#if overlay}
	<div class="blackOverlay" out:fade={{ duration: 2000 }} />
{/if}

<div class="backgroundImage" style="background-image: url({$preloadedAssets.background});">
	{#each openWindows as window}
		<Window
			bind:windows={openWindows}
			{debug}
			{getNextZIndex}
			{toastWrapper}
			title={window.title}
			id={window.id}
			x={window.x}
			y={window.y}
			width={window.width}
			height={window.height}
		>
			<svelte:component
				this={window.component}
				{openWindow}
				passToComponent={window.passToComponent}
			/>
		</Window>
	{/each}

	<div class="desktopIcons">
		{#each desktopIcons as icon}
			<button
				class="desktopIcon"
				on:click={() => {
					//unclick all icons
					desktopIcons.forEach((i) => {
						if (i.id === icon.id) return;
						i.clicked = false;
					});

					if (icon.clicked) {
						if (icon.run) icon.run();
						else
							openWindow({
								...icon,
								title: icon.text
							});
						icon.clicked = false;
					} else {
						icon.clicked = true;
					}
				}}
				class:clicked={icon.clicked}
			>
				{#if typeof icon.icon === 'string'}
					<img src={icon.icon} class="desktopIcon-img" alt="icon" />
				{:else}
					<span class="desktopIcon-fa">
						<Fa icon={icon.icon} alt="icon" color={icon.color || 'white'} /></span
					>
				{/if}
				<p class="desktopIcon-text">{icon.text}</p>
			</button>
		{/each}
	</div>
</div>

<style>
	.blackOverlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: black;
		z-index: 10;
	}

	.backgroundImage {
		background-size: cover;
		background-position: center;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.desktopIcons {
		margin-top: 10px;
	}
	.desktopIcon {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 5px;
		padding-bottom: 5px;

		background: transparent;
		border: none;
		border-radius: 5px;
		margin-bottom: 10px;
	}

	.desktopIcon:hover {
		background-color: rgba(255, 255, 255, 0.2);
		transition: background-color 0.2s;
	}

	.clicked {
		background-color: rgba(255, 255, 255, 0.4) !important;
		cursor: pointer;
	}

	.desktopIcon-img {
		width: 50px;
	}
	.desktopIcon-fa {
		font-size: 40px;
		width: 50px;
	}

	.desktopIcon-text {
		margin-top: 5px;
		font-size: 13px;
		color: white;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		margin-bottom: 0;
	}

	.toaster {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
</style>
