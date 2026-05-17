<script>
	import { faWindows, faGithub } from '@fortawesome/free-brands-svg-icons';
	import { onDestroy, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Window from '$lib/Window.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import Fa from 'svelte-fa';
	import toast, { Toaster } from 'svelte-french-toast';
	import { preloadedAssets } from '$lib/stores.js';
	import { goto } from '$app/navigation';
	import {
		faArrowLeft,
		faCheckCircle,
		faPowerOff,
		faVolumeHigh
	} from '@fortawesome/free-solid-svg-icons';
	import { getScreenSize, availableComponents } from '$lib/utils.js';
	import { biosSettings } from '$lib/stores.js';
	let zindex = 1;
	let volume = 0.5;

	let currentAudio;

	let time = new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
	let date = new Date().toLocaleDateString('nl-NL', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	});

	let startMenu = false;
	let soundsMenu = false;

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
		const { screenW, screenH } = getScreenSize();

		windowData.width ||= 400;
		windowData.height ||= 200;

		windowData.width = Math.min(windowData.width, screenW);
		windowData.height = Math.min(windowData.height, screenH);

		const x = screenW - windowData.width > 0 ? screenW / 2 - windowData.width / 2 : 0;
		const y = screenH - windowData.height > 0 ? screenH / 2 - windowData.height / 2 : 0;

		const newWindow = {
			component: windowData.component,
			title: windowData.title,
			id: uuidv4(),
			x,
			y,
			width: windowData.width,
			height: windowData.height,
			passToComponent: windowData.passToComponent || {},
			icon: windowData.icon || ''
		};

		openWindows = [...openWindows, newWindow];
		setTimeout(() => {
			focusWindow(newWindow.id);
		}, 10);
	}

	function focusWindow(id) {
		for (let i = 0; i < openWindows.length; i++) {
			if (openWindows[i].id === id) {
				if (currentFocus === id) {
					openWindows[i].focus = true;
					currentFocus = null;
					setTimeout(() => {
						openWindows[i].focus = false;
					}, 1);
				} else {
					currentFocus = id;
					openWindows[i].comeToTop = true;
					setTimeout(() => {
						openWindows[i].comeToTop = false;
					}, 1);
				}
			}
		}

		openWindows = [...openWindows];
	}

	let overlay = true;
	let debug = false;
	onMount(async () => {
		if ($preloadedAssets.loading) goto('/');
		else overlay = false;

		const audio = new Audio($preloadedAssets.bootup);
		if (!overlay && $biosSettings.sound.value) audio.play();

		setInterval(() => {
			time = new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
			date = new Date().toLocaleDateString('nl-NL', {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric'
			});
		}, 1000);

		setTimeout(() => {
			const desktopIcon = desktopIcons.find((i) => i.text === 'about.txt');
			if (desktopIcon) {
				openWindow({
					...desktopIcon,
					title: desktopIcon.text
				});
			}
		}, 1000);
	});

	onMount(async () => {
		const tracks = [
			'24K Magic.mp3',
			'All Star (from Shrek).mp3',
			'Animals.mp3',
			'Blue (Da Ba Dee).mp3',
			'Cake by the Ocean.mp3',
			"Can't Stop The Feeling.mp3",
			'Cheerleader.mp3',
			'Eye of the Tiger.mp3',
			'Get Lucky.mp3',
			'Harder Better Faster Stronger.mp3',
			'Immortals.mp3',
			'Never Gonna Give You Up.mp3',
			'Shape Of You.mp3',
			'Take On Me.mp3',
			'Timber.mp3',
			'Turn Down For What.mp3',
			'Uptown Funk.mp3',
			'Where Are U Now.mp3'
		];

		async function playRandomTrack() {
			if (overlay || !$biosSettings.music.value) return;

			await new Promise((r) => setTimeout(r, 3000));
			const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
			currentAudio = new Audio(`/tracks/${randomTrack}`);
			currentAudio.volume = volume;
			currentAudio.play();

			toastWrapper('Now playing: ' + randomTrack, 'success');
			currentAudio.addEventListener('ended', playRandomTrack);

			// Wait for audio to truly start playing (browser autoplay policy)
			while (currentAudio.currentTime === 0) {
				await new Promise((r) => setTimeout(r, 100));
				currentAudio.play();
			}
		}

		playRandomTrack();
	});

	onDestroy(async () => {
		if (currentAudio) {
			while (currentAudio.volume > 0.1) {
				currentAudio.volume -= 0.1;
				await new Promise((r) => setTimeout(r, 100));
			}
			currentAudio.pause();
		}
	});

	let desktopIcons = [
		{
			icon: $preloadedAssets.explorer,
			text: 'Projects',
			component: 'Explorer',
			width: 500,
			height: 600
		},
		{
			icon: $preloadedAssets.txt,
			text: 'about.txt',
			component: 'Text',
			width: 700,
			height: 450,
			passToComponent: {
				text: `Hey! I'm Daan, better known online as Danny or dandandev. I'm a developer from The Netherlands, where I've lived my whole life.
<br/><br/>
My obsession with tech started early. When I was around 5 or 6, I was already “hacking” into my primary school’s computers and inspecting everything with Control + Shift + I. That curiosity never really went away.
<br/><br/>
I started out building games and animations in Scratch, then moved on to Processing and Arduino projects. Eventually I discovered Node.js, which opened the door to web development and backend programming. Along the way I also experimented with Java, Python, and Skript.
<br/><br/>
These days I mainly focus on building polished, user-oriented web experiences (insert more buzzwords here) using SvelteKit and Next.js. I enjoy creating fast, interactive applications with strong UX, clean architecture, and just the right amount of overengineering (as im sure you've noticed by now).<br/><br/>
Anyway, enjoy the rest of my little corner of the internet!
                `,
				allowHTML: true
			}
		},
		{
			icon: $preloadedAssets.txt,
			text: 'skills.txt',
			component: 'Text',
			width: 700,
			height: 470,
			passToComponent: {
				text: `
				<ul>
	<li>SvelteKit</li>
	<li>Next.js / React Native</li>
	<li>Node.js / TypeScript (+ tRPC, Express, Socket.IO, Prisma, Discord.js, and more)</li>
	<li>Cloudflare: Built and deployed high-traffic edge-powered applications and managed DNS/firewall infrastructure for multiple companies.</li>
	<li>Bunny.net: Implemented large parts of the Bunny.net suite into advanced dynamic web applications.</li>
	<li>Infrastructure: Managed multiple servers/services, including complex clusters, load balancing, caching layers, queues, and production-ready infrastructure.</li>
	<li>Self-hosting: Running multiple self-hosted services on my Dell PowerEdge R710 (aka power hog) using TrueNAS and Coolify.</li>
	<li>Backend Architecture: Designed custom authentication systems, database structures, networking setups, and scalable backend systems.</li>
	<li>Performance & Scaling: Built load-ready applications using queues, aggressive caching, and techniques that make dynamic applications behave like static sites.</li>
	<li>Web Scraping / Reverse Engineering: Worked on projects involving advanced scraping, reverse engineering, and authentication flow analysis.</li>
</ul>

Anything not mentioned here? Feel free to ask me about it :D`,
				allowHTML: true
			}
		},
		{
			icon: $preloadedAssets.txt,
			text: 'contact.txt',
			component: 'Text',
			width: 550,
			height: 200,
			passToComponent: {
				text: `Want to have a chat? Feel free to hit me up using any (or all) of the following methods:`,
				buttons: [
					{
						text: 'Send me an email',
						action: () => {
							location = 'mailto:site@dandandev.xyz';
						}
					},
					{
						text: 'Contact me on WhatsApp',
						action: () => {
							location = 'https://wa.me/31502113616';
						}
					},
					{
						text: 'Contact me on Discord',
						action: () => {
							location = 'https://discord.com/users/654390669472694284/';
						}
					}
				]
			}
		},
		{
			icon: faGithub,
			text: 'Github',
			run: () => {
				alert(
					'I have a lot of projects private so my GitHub might not be the best place to look at my full portfolio. Feel free to contact me and ill show you some private projects.'
				);
				window.open('https://github.com/dandanthedev');
			}
		},
		{
			icon: $preloadedAssets.linkedin,
			text: 'LinkedIn',
			run: () => {
				window.open('https://www.linkedin.com/in/dandandev/');
			},
			color: '#0A66C2'
		},
		{
			icon: faCheckCircle,
			text: 'Thing Battle',
			component: 'Choices',
			width: 700,
			height: 400
		},
		{
			icon: $preloadedAssets.excel,
			text: 'thingbattleresults.xslx',
			component: 'ChoicesResults',
			width: 800,
			height: 400
		},
		{
			icon: $preloadedAssets.pc,
			text: 'About this PC',
			component: 'Credits',
			width: 800,
			height: 200
		},

		$biosSettings.debug.value && {
			icon: $preloadedAssets.debugger,
			text: 'Debug',
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
	desktopIcons = desktopIcons.filter((i) => i);
	desktopIcons.forEach((i) => (i.id = uuidv4()));

	let openWindows = [];

	let startX = null;
	let startY = null;

	let endX = null;
	let endY = null;
	let desktopFocus = false;

	let currentFocus = null;

	function mouseDown(e) {
		if (
			!e.target.classList.contains('backgroundImage') &&
			!e.target.classList.contains('desktopIcons') &&
			!document.querySelector('.desktopIcons').contains(e.target)
		) {
			desktopFocus = false;
			return;
		}

		desktopFocus = true;

		startX = e.clientX;
		startY = e.clientY;

		endX = startX;
		endY = startY;

		updateSelection();
	}

	function mouseMove(e) {
		if (!startX || !startY) return;

		endX = e.clientX;
		endY = e.clientY;

		updateSelection();
	}

	function mouseUp(e) {
		let foundWindowFocus = false;
		let parent = e.target;
		while (parent) {
			if (parent.dataset.windowid) {
				currentFocus = parent.dataset.windowid;
				foundWindowFocus = true;
				break;
			}
			parent = parent.parentElement;
		}

		if (!foundWindowFocus && openWindows.every((w) => !w.comeToTop)) {
			currentFocus = null;
		}

		startX = null;
		startY = null;

		endX = null;
		endY = null;

		updateSelection();
	}

	let selectionThingOpen = false;
	let topLeftX = 0;
	let topLeftY = 0;

	let width = 0;
	let height = 0;

	function updateSelection() {
		if (!startX || !startY || !endX || !endY) {
			selectionThingOpen = false;
			return;
		}

		width = Math.abs(startX - endX);
		height = Math.abs(startY - endY);

		if (Math.sqrt(width * width + height * height) < 10) {
			selectionThingOpen = false;
			return;
		}

		selectionThingOpen = true;

		topLeftX = Math.min(startX, endX);
		topLeftY = Math.min(startY, endY);

		let selectedDesktopIconElements = new WeakSet();

		for (const desktopIconElement of desktopIconElements) {
			const rect = desktopIconElement.getBoundingClientRect();

			if (
				topLeftX < rect.left + rect.width &&
				topLeftX + width > rect.left &&
				topLeftY < rect.top + rect.height &&
				topLeftY + height > rect.top
			) {
				selectedDesktopIconElements.add(desktopIconElement);
			}
		}

		for (const desktopIcon of desktopIcons) {
			desktopIcon.clicked = selectedDesktopIconElements.has(
				desktopIconElements[desktopIcons.indexOf(desktopIcon)]
			);
		}
		desktopIcons = [...desktopIcons];
	}

	let desktopIconElements = [];
	onMount(() => {
		desktopIconElements = document.querySelectorAll('.desktopIcon');
	});

	function keyPress(e) {
		if (e.key === 'Enter') {
			if (!desktopFocus) return;
			//open all selected icons
			for (const desktopIcon of desktopIcons) {
				if (desktopIcon.clicked) {
					if (desktopIcon.run) desktopIcon.run();
					else
						openWindow({
							...desktopIcon,
							title: desktopIcon.text
						});
					desktopIcon.clicked = false;
				}
			}

			desktopIcons = [...desktopIcons];

			//focus the body
			document.body.focus();
		}
	}
</script>

<svelte:window
	on:mousedown={mouseDown}
	on:mouseup={mouseUp}
	on:mousemove={mouseMove}
	on:keypress={keyPress}
/>

<div
	class="desktopSelection"
	style="display: {selectionThingOpen
		? 'block'
		: 'none'}; top: {topLeftY}px; left: {topLeftX}px; width: {width}px; height: {height}px;"
></div>

<span class="toaster">
	<Toaster />
</span>

{#if overlay}
	<div class="blackOverlay" out:fade={{ duration: 2000 }} in:fade={{ duration: 500 }} />
{/if}

<div class="backgroundImage" style="background-image: url({$preloadedAssets.background});">
	{#if debug}
		<p class="debug">
			<b>Current focus:</b>
			{currentFocus}
			<br />
			<b>Windows:</b>
			{openWindows.map((w) => w.id).join(', ')}
		</p>
	{/if}
	{#each openWindows as window (window.id)}
		<Window
			bind:windows={openWindows}
			bind:focus={window.focus}
			bind:currentlyFocused={window.focus}
			bind:focussedWindow={currentFocus}
			bind:zIndex={window.zIndex}
			bind:comeToTop={window.comeToTop}
			{debug}
			{getNextZIndex}
			{toastWrapper}
			title={window.title}
			id={window.id}
			initialX={window.x}
			initialY={window.y}
			initialWidth={window.width}
			initialHeight={window.height}
			on:windowUnfocused={(e) => {
				if (currentFocus === e.detail) {
					currentFocus = null;
				}
			}}
		>
			<svelte:component
				this={availableComponents[window.component]}
				{openWindow}
				passToComponent={window.passToComponent}
				{toastWrapper}
			/>
		</Window>
	{/each}

	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="desktopIcons"
		on:mousedown={(e) => {
			if (e.target.classList.contains('desktopIcon') || e.target.closest('.desktopIcon')) {
				//clicked on an icon, not the desktop
				return;
			}
			desktopIcons.forEach((i) => {
				i.clicked = false;
			});
			desktopIcons = [...desktopIcons];

			//close all menus (todo: yuck)
			startMenu = false;
			soundsMenu = false;
		}}
	>
		{#each desktopIcons as icon}
			<button
				class="desktopIcon"
				data-desktopIcon={icon.id}
				on:mousedown={(e) => {
					//unclick all icons if not holding ctrl
					if (!e.ctrlKey)
						desktopIcons.forEach((i) => {
							if (i.id === icon.id) return;
							i.clicked = false;
						});
				}}
				on:mouseup={(e) => {
					if (selectionThingOpen) return;
					if (!icon.clicked) return (icon.clicked = true);
					if (icon.run) icon.run();
					else
						openWindow({
							...icon,
							title: icon.text
						});
					icon.clicked = false;
				}}
				on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						if (icon.run) icon.run();
						else
							openWindow({
								...icon,
								title: icon.text
							});
						icon.clicked = false;
					}
				}}
				class:clicked={icon.clicked}
			>
				{#if typeof icon.icon === 'string'}
					<img src={icon.icon} class="desktopIcon-img" alt="icon" />
				{:else}
					<span
						class="desktopIcon-fa"
						style="background-color: {icon.backgroundColor || 'transparent'};"
					>
						<Fa icon={icon.icon} alt="icon" color={icon.color || 'white'} /></span
					>
				{/if}
				<p class="desktopIcon-text">{icon.text}</p>
			</button>
		{/each}
	</div>

	<div class="bottomBar">
		<button
			class="startButton winButton"
			on:click={() => {
				startMenu = !startMenu;
			}}
		>
			<Fa icon={faWindows} size="2x" />
		</button>
		<div class="openApps">
			{#each openWindows as window}
				<button
					class="openApp"
					transition:fly={{ y: 100, duration: 200 }}
					on:click={() => {
						focusWindow(window.id);
					}}
				>
					{#if window.icon}
						{#if typeof window.icon === 'string'}
							<img src={window.icon} alt="icon" />
						{:else}
							<span class="desktopIcon-fa">
								<Fa icon={window.icon} alt="icon" color={window.color || 'white'} /></span
							>
						{/if}
					{/if}
				</button>
			{/each}
		</div>

		<div class="right">
			<button
				class="volume"
				on:click={() => {
					soundsMenu = !soundsMenu;
				}}
			>
				<Fa icon={faVolumeHigh} />
			</button>
			<p class="dateTime">
				{time}<br />
				{date}
			</p>
		</div>
	</div>

	{#if startMenu}
		<div class="startMenu" transition:fly={{ y: 100, duration: 200 }}>
			<div class="startMenu-sidebar">
				<div class="startMenu-sidebar-spacer" />

				<button
					class="startMenu-sidebar-button"
					on:click={async () => {
						overlay = true;
						const audio = new Audio($preloadedAssets.shutdown);
						if ($biosSettings.sound.value) audio.play();
						await new Promise((r) => setTimeout(r, 1000));
						goto('/');
					}}
				>
					<Fa icon={faArrowLeft} size="2x" />
				</button>
				<button
					class="startMenu-sidebar-button"
					on:click={async () => {
						overlay = true;
						const audio = new Audio($preloadedAssets.shutdown);
						audio.play();

						//fadeout music
						while (currentAudio.volume > 0.1) {
							currentAudio.volume -= 0.1;
							await new Promise((r) => setTimeout(r, 100));
						}
						currentAudio.pause();
					}}
				>
					<Fa icon={faPowerOff} size="2x" />
				</button>
			</div>
		</div>
	{/if}
	{#if soundsMenu}
		<div class="soundsMenu" transition:fly={{ y: 5, duration: 200 }}>
			<input
				type="range"
				min="0"
				max="1"
				step="0.01"
				bind:value={volume}
				on:input={() => {
					currentAudio.volume = volume;
				}}
				class="volumeSlider"
			/>
		</div>
	{/if}
</div>

<style>
	.desktopSelection {
		z-index: 10;
		position: fixed;

		top: 0;
		left: 0;

		width: 500px;
		height: 500px;

		background-color: #258bea37;
		border: 1px solid #015da3;

		pointer-events: none;
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

	.backgroundImage {
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-attachment: fixed;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		max-width: 100vw;
		max-height: 100vh;
		-webkit-user-drag: none;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}

	.desktopIcons {
		margin-top: 10px;

		height: calc(100% - 55px);
		display: grid;
		grid-template-columns: repeat(auto-fill, 74px);
		grid-template-rows: repeat(auto-fill, 70px);
		grid-auto-flow: column;
		padding-top: 6px;
		gap: 28px 1px;
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

		width: 84px;
		height: 90px;

		margin-bottom: 10px;
	}

	.desktopIcon:hover {
		background-color: rgba(255, 255, 255, 0.2);
		transition: background-color 0.2s ease;
	}

	.clicked {
		background-color: rgba(255, 255, 255, 0.4) !important;
		cursor: pointer;
	}

	.desktopIcon-img {
		width: 50px;
		height: 50px;

		object-fit: contain;
	}
	.desktopIcon-fa {
		font-size: 40px;
		width: 50px;
	}

	.desktopIcon-text {
		margin-top: 5px;
		font-size: 13px;
		word-wrap: break-word;
		white-space: normal;
		width: 100%;
		color: white;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		margin-bottom: 0;
	}

	.bottomBar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 40px;
		background-color: #213540;
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.startButton {
		background-color: transparent;
		border: none;
		font-size: 0.9em;
		color: white;
		cursor: pointer;
	}
	.winButton {
		margin-left: 5px;
		transition: color 0.2s;
	}

	.winButton:hover {
		color: #357ec7;
	}

	.dateTime {
		margin-left: auto;
		margin-right: 10px;

		font-size: 0.8em;
		color: white;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

		text-align: center;
	}
	.toaster {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.startMenu {
		position: fixed;
		bottom: 40px;
		left: 0;
		width: 500px;
		height: 600px;
		background-color: #23343b;
		border-radius: 5px;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.startMenu-sidebar {
		position: absolute;
		top: 0;
		left: 0;
		width: 50px;
		height: 100%;
		background-color: #23343b;
	}

	.startMenu-sidebar-spacer {
		height: 89%;
	}

	.startMenu-sidebar-button {
		background: transparent;
		border: none;
		color: #e3f1f4;
		font-size: 0.7em;
		padding: 0.3rem 1rem;
		transition: background-color 0.2s ease;
	}
	.startMenu-sidebar-button:hover {
		background-color: #357ec7;
	}

	.right {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-left: auto;
	}

	.volume {
		background: transparent;
		border: none;
		color: white;
		cursor: pointer;
		width: 35px;
		margin-top: 3px;

		transition: filter 0.2s;
		font-size: 1em;
	}

	.volume:hover {
		filter: brightness(1.2);
	}

	.soundsMenu {
		position: fixed;
		bottom: 40px;
		right: 10px;
		background-color: #00426c;
		border-radius: 5px;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		white-space: pre-line;
	}

	.volumeSlider {
		width: 90%;
		display: block;
		margin-left: auto;
		margin-right: auto;
		margin-top: 10px;
	}

	.openApps {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-right: 30px;
	}

	.openApp {
		background: transparent;
		border: none;
		color: white;
		cursor: pointer;
		height: 100%;
		padding-left: 15px;
		padding-right: 15px;
		transition: background-color 0.2s;
		border-radius: 5px;
	}

	.openApp img {
		width: 30px;
		height: 30px;
		object-fit: contain;
	}

	.openApp span {
		font-size: 30px;
		width: 30px;
	}

	.openApp:hover {
		background-color: #357ec7;
	}

	.debug {
		position: fixed;
		top: 10px;
		right: 10px;
		color: white;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-size: 1em;
		padding: 0.3rem 1rem;
		text-align: right;
		max-width: 500px;
	}
</style>
