<script>
	import { faWindows } from '@fortawesome/free-brands-svg-icons';
	import { preloadedAssets, biosSettings, didInitLocals } from '$lib/stores.js';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import { fade } from 'svelte/transition';
	import { goto, preloadData } from '$app/navigation';
	import { initSocket } from '$lib/sockets/sounds.js';
	let overlay = true;
	let wentToBios = false;
	let loadingText = '';
	let assets = {
		background: '/background.jpg',
		volume: '/taskbar/volume.png',

		explorer: '/icons/explorer.png',
		debugger: '/icons/debugger.png',
		chrome: '/icons/chrome.png',
		linkedin: '/icons/linkedin.png',
		pc: '/icons/pc.png',

		txt: '/icons/txt.png',
		excel: '/icons/excel.png',

		bootup: $biosSettings.sound.value ? '/bootup.mp3' : null,
		shutdown: $biosSettings.sound.value ? '/shutdown.mp3' : null,

		win11img: $biosSettings.trolls.value ? '/win11.jpg' : null,
		win11vid: $biosSettings.trolls.value ? '/win11.mp4' : null
	};

	async function load() {
		for (const key in $biosSettings) {
			if (localStorage.getItem(`biosSettings.${key}`)) {
				$biosSettings[key].value = JSON.parse(localStorage.getItem(`biosSettings.${key}`));
			}
		}
		didInitLocals();
		overlay = false;
		await new Promise((r) => setTimeout(r, 1000)); //wait for fadein

		loadingText = 'Loading scripts...';
		await preloadData('/home');

		//start asset fetching
		for (const [key, value] of Object.entries(assets)) {
			if (!value || !key) continue;
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

		if (wentToBios) return;

		// //TROLLS
		const trolls = ['update', '11'];
		if (Math.random() < 0.1 && $biosSettings.trolls.value) {
			return goto(`/trolls/${trolls[Math.floor(Math.random() * trolls.length)]}`);
		}

		goto('/home');
	}

	onMount(async () => {
		load();

		//on delete press, go to bios
		function onKeydown(e) {
			if (e.key === 'Delete') {
				wentToBios = true;
				goto('/bios');
			}
		}

		window.addEventListener('keydown', onKeydown);

		return () => {
			window.removeEventListener('keydown', onKeydown);
		};
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
<p class="biosKey">Press DEL to enter BIOS</p>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap');

	@font-face {
		font-family: 'ibm';
		src: url('/ibm.woff') format('woff');
	}

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
		font-size: 75px !important;
		height: 1em;
		color: #357ec7;
		margin-bottom: 20px;
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

	.biosKey {
		position: fixed;
		bottom: 10px;
		right: 10px;
		color: white;
		font-family: 'ibm';
		font-size: 0.7em;
	}
</style>
