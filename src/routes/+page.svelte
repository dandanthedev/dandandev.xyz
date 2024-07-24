<script>
	import { faWindows } from '@fortawesome/free-brands-svg-icons';
	import { preloadedAssets } from '$lib/stores.js';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { initSocket } from '$lib/sockets/sounds.js';
	let overlay = true;
	let loadingText = '';
	let assets = {
		background: '/background.jpg',
		volume: '/taskbar/volume.png',

		explorer: '/icons/explorer.png',
		debugger: '/icons/debugger.png',
		chrome: '/icons/chrome.png',
		linkedin: '/icons/linkedin.png',

		txt: '/icons/txt.png',
		excel: '/icons/excel.png',

		bootup: '/bootup.mp3',
		shutdown: '/shutdown.mp3',

		win11img: '/win11.jpg',
		win11vid: '/win11.mp4'
	};

	async function load() {
		overlay = false;
		await new Promise((r) => setTimeout(r, 1000)); //wait for fadein

		//start asset fetching
		for (const [key, value] of Object.entries(assets)) {
			loadingText = `Loading ${key}...`;
			const asset = await fetch(value).catch((e) => {
				loadingText = 'Failed to load ' + key;
				return null;
			});

			if (!asset) return;

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

		//connect to sounds server
		loadingText = 'Connecting to soundserver...';
		await initSocket();

		overlay = true;
		await new Promise((r) => setTimeout(r, 2000)); //wait for fadeout

		//TROLLS
		const trolls = ['update', '11'];
		if (Math.random() < 0.1) {
			return goto(`/trolls/${trolls[Math.floor(Math.random() * trolls.length)]}`);
		}

		goto('/home');
	}

	onMount(async () => {
		load();
	});
</script>

{#if overlay}
	<div class="blackOverlay" out:fade={{ duration: 1000 }} in:fade={{ duration: 500 }} />
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
	@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap');
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
		text-align: center;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color: white;
		font-family: 'Source Code Pro', monospace;
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
