<script>
	import { faWindows } from '@fortawesome/free-brands-svg-icons';
	import { preloadedAssets } from '$lib/stores.js';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	let overlay = true;
	let loadingText = 'Initialising...';
	let assets = {
		background: '/background.jpg',

		explorer: '/icons/explorer.png',
		debugger: '/icons/debugger.png'
	};
	onMount(async () => {
		overlay = false;
		await new Promise((r) => setTimeout(r, 1000)); //wait for fadein

		//start asset fetching
		for (const [key, value] of Object.entries(assets)) {
			loadingText = `Loading ${key}...`;
			const asset = await fetch(value);
			//base64 encode the asset
			assets[key] = await asset.blob().then(
				(blob) =>
					new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.onloadend = () => resolve(reader.result);
						reader.onerror = reject;
						reader.readAsDataURL(blob);
					})
			);
		}

		$preloadedAssets = assets;

		overlay = true;
		await new Promise((r) => setTimeout(r, 2000)); //wait for fadeout
		goto('/home');
	});
</script>

{#if overlay}
	<div class="blackOverlay" out:fade={{ duration: 2000 }} in:fade={{ duration: 500 }} />
{/if}

<div class="bootScreen">
	<div class="bootScreen-logo">
		<Fa icon={faWindows} size="2x" />
	</div>
	<div class="bootScreen-loader">
		<span class="loader"></span>
	</div>
	<p class="bootScreen-text">
		{loadingText}
	</p>
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

	.bootScreen {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: black;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.bootScreen-logo {
		font-size: 80px;
		color: #357ec7;
	}
	.bootScreen-loader {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 100px;
	}

	.bootScreen-text {
		position: fixed;
		left: 10px;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color: white;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.loader {
		width: 48px;
		height: 48px;
		border: 5px solid #fff;
		border-bottom-color: transparent;
		border-radius: 50%;
		display: inline-block;
		box-sizing: border-box;
		animation: rotation 1s linear infinite;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
