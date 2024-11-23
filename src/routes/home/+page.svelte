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
	import { faArrowLeft, faCheckCircle, faPowerOff } from '@fortawesome/free-solid-svg-icons';
	import { getList, play } from '$lib/sockets/sounds.js';
	import { getScreenSize, availableComponents } from '$lib/utils.js';
	import { setToastWrapper } from '$lib/sockets/sounds.js';
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

	setToastWrapper(toastWrapper);

	export function openWindow(windowData) {
		const { screenW, screenH } = getScreenSize();

		if (debug) {
			if (!windowData.component) return toastWrapper('No component specified', 'error');
			if (!windowData.title) return toastWrapper('No title specified', 'error');
		}

		if (!windowData.width) windowData.width = 400;
		if (!windowData.height) windowData.height = 200;

		if (windowData.width > screenW) windowData.width = screenW;
		if (windowData.height > screenH) windowData.height = screenH;

		if (debug)
			toastWrapper('w: ' + windowData.width + ' h: ' + windowData.height, 'success', {
				icon: '⚠️',
				duration: 5000
			});

		if (debug) console.log(screenW, screenH);
		if (debug) console.log(windowData.width, windowData.height);
		let gennedX = 0;
		let gennedY = 0;

		const newWindow = {
			component: windowData.component,
			title: windowData.title,
			id: uuidv4(),
			x: gennedX,
			y: gennedY,
			width: windowData.width,
			height: windowData.height,
			passToComponent: windowData.passToComponent || {},

			icon: windowData.icon || ''
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

	function focusWindow(id) {
		for (let i = 0; i < openWindows.length; i++) {
			if (openWindows[i].id === id) {
				// openWindows[i].focus = true;

				// currentFocus = openWindows[i].id;

				// setTimeout(() => {
				// 	openWindows[i].focus = false;
				// }, 1);

				// break;

				if (currentFocus === id) {
					openWindows[i].focus = true;
					currentFocus = null;
					setTimeout(() => {
						openWindows[i].focus = false;
					}, 1);
				} else {
					currentFocus = id;
					//bring to top
					openWindows[i].comeToTop = true;
					setTimeout(() => {
						openWindows[i].comeToTop = false;
					}, 2);
				}
			}
		}
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
	});

	onMount(async () => {
		const tracks = [
			'24K Magic.mp3 ',
			'All Star (from Shrek).mp3 ',
			'Animals.mp3 ',
			'Blue (Da Ba Dee).mp3 ',
			'Cake by the Ocean.mp3 ',
			"Can't Stop The Feeling.mp3 ",
			'Cheerleader.mp3 ',
			'Eye of the Tiger.mp3 ',
			'Get Lucky.mp3 ',
			'Harder Better Faster Stronger.mp3 ',
			'Immortals.mp3',
			'Never Gonna Give You Up.mp3 ',
			'Shape Of You.mp3 ',
			'Take On Me.mp3 ',
			'Timber.mp3 ',
			'Turn Down For What.mp3 ',
			'Uptown Funk.mp3 ',
			'Where Are U Now.mp3'
		];

		async function playRandomTrack() {
			if (overlay) return;
			if (!$biosSettings.music.value) return;

			await new Promise((r) => setTimeout(r, 3000));
			const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
			currentAudio = new Audio(`/tracks/${randomTrack}`);
			currentAudio.volume = volume;
			currentAudio.play();

			toastWrapper('Now playing: ' + randomTrack, 'success');

			currentAudio.addEventListener('ended', playRandomTrack);

			while (currentAudio.currentTime === 0) {
				//AUDIO POLICY JAZZ
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
			text: 'Explorer',
			component: 'Explorer',
			width: 500,
			height: 600
		},
		{
			icon: $preloadedAssets.txt,
			text: 'about.txt',
			component: 'Text',
			width: 700,
			height: 400,
			passToComponent: {
				text: `Heya! My name is Daan, better known online as dandandev/DannyDanDan. I live in The Netherlands. I also grew up and go to school there. I quickly discovered my obsession to everything tech related when i was about 5-6. I've been tinkering with everything that makes those beep boop sounds ever since.<br/><br/>

My journey started with Scratch, where i made a lot of games and animations. After that i started learning Processing and some Arduino. After this i discovered Node.js, which i've been using for a while now. I've also tried some Java, Python & Skript.<br/><br/>

Nowadays i mainly spend my time building webapps with SvelteKit. I ❤️ Svelte(kit) and use it to build all my websites, even the one you're looking at right now!<br/><br/>

Before Svelte, i used React, which i now use to build mobile apps.<br/><br/>

My birthday is on the 22nd of November.
                `,
				allowHTML: true
			}
		},
		{
			icon: $preloadedAssets.txt,
			text: "skills.txt",
			component: "Text",
			width: 700,
			height: 350,
			passToComponent: {
				text: `SvelteKit: very experienced. <br/>
				React (Native) (/Next.js): very experienced but not my favorite <a target="_blank" href="https://www.reddit.com/r/reactjs/comments/126uzfo">library</a> <br/>
				Node.js/TypeScript (+TRPC, Express, Socket.io, Prisma, Discord.js): very experienced <br/>
				Python: beginner <br/>
				Java: i can make hello world? <br/>
				Cloudflare: managed DNS/Firewall infrastructure for multiple companies.<br/>
				Bunny.net: Implemented bunny.net stream into advanced dynamic web apps.<br/>
				Infrastructure: Managed multiple serv(ers/ices), including complex clusters and load balancing.<br/>
				Web Scraping/Reverse Engineering: I've worked on multiple projects that included very complex web scraping and reverse engineering of their entire authentication system.<br/>
				<br/>
				+ probably some other stuff i forgot. Feel free to ask me about it :D`,
				allowHTML: true
				},
			},
		{
			icon: $preloadedAssets.txt,
			text: 'contact.txt',
			component: 'Text',
			width: 400,
			height: 200,
			passToComponent: {
				text: `Yes, i see you, tHeSe bUtTonS doNt ExIsT iN NorMaL WiNDows!!! (dont care didnt ask)`,
				buttons: [
					{
						text: 'Send me an email',
						action: () => {
							location = 'mailto:hey@dandandev.xyz';
						}
					},
					{
						text: 'Contact me on Discord',
						action: () => {
							location = 'https://discord.com/users/654390669472694284';
						}
					}
				]
			}
		},
		// {
		// 	icon: $preloadedAssets.chrome,
		// 	text: 'message.html',
		// 	component: 'SendMessage',
		// 	width: 400,
		// 	height: 200
		// },
		{
			icon: faGithub,
			text: 'Github',
			run: () => {
				window.open('https://github.com/dandanthedev/daanschenkel.nl-desktop');
			}
		},
		{
			icon: $preloadedAssets.linkedin,
			text: 'LinkedIn',
			run: () => {
				window.open('https://www.linkedin.com/in/daan-schenkel-b65726226/');
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
			width: 600,
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
		let internal_foundCurrentFocus = false;
		//check if any of the parents of the element have data-windowid
		let parent = e.target;
		while (parent) {
			if (debug) console.log(parent.classList.toString(), parent.dataset);
			if (parent.dataset.windowid) {
				setTimeout(() => {
					currentFocus = parent.dataset.windowid;
				}, 1);
				internal_foundCurrentFocus = true;
				break;
			}
			parent = parent.parentElement;
		}

		setTimeout(() => {
			if (!internal_foundCurrentFocus) {
				//if no window has comeToTop, then set currentFocus to null
				if (openWindows.every((w) => !w.comeToTop)) currentFocus = null;
			}
		}, 1);

		startX = null;
		startY = null;

		endX = null;
		endY = null;

		updateSelection();
	}

	let display = false;
	let topLeftX = 0;
	let topLeftY = 0;

	let width = 0;
	let height = 0;

	function updateSelection() {
		if (!startX || !startY || !endX || !endY) {
			display = false;
			return;
		}

		width = Math.abs(startX - endX);
		height = Math.abs(startY - endY);

		if (Math.sqrt(width * width + height * height) < 10) {
			display = false;
			return;
		}

		display = true;

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
	style="display: {display
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
		<p class="currentFocus">Current focus: {currentFocus}</p>
	{/if}
	{#each openWindows as window (window.id)}
		<Window
			bind:windows={openWindows}
			bind:focus={window.focus}
			bind:currentlyFocused={window.currentlyFocused}
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

	<div class="desktopIcons">
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
				<img src={$preloadedAssets.volume} alt="volume" />
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
			{#if $biosSettings.soundserver.value}
				<div class="soundList">
					{#await getList()}
						<p class="loading">Loading...</p>
					{:then list}
						{#each list as sound}
							<button
								class="sound"
								on:click={() => {
									play(sound);
								}}
							>
								<p>{sound}</p>
							</button>
						{/each}
					{/await}
				</div>
				<p class="note">btw: these play for everyone currently on the site, including me :)</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.currentFocus {
		position: fixed;
		top: 0;
		right: 10px;
		color: white;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
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

		/*to prevent custom dragging from being interfered with*/
		user-drag: none;
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
		transition: background-color 0.2s;
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
		/*wrap text*/
		word-wrap: break-word;
		white-space: normal;
		/*prevent text from overflowing its container*/
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
		padding-left: 12px;
		padding: 1rem;
		padding-bottom: 0.3rem;
		padding-top: 0.3rem;
		transition: background-color 0.2s;
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
	}

	.volume:hover {
		filter: brightness(1.2);
	}

	.volume img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
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

		/*overflow to newline*/
		white-space: pre-line;
	}

	.volumeSlider {
		width: 90%;
		display: block;
		margin-left: auto;
		margin-right: auto;
		margin-top: 10px;
	}

	.soundList {
		height: calc(100% - 40px);
		overflow-y: auto;
	}

	.loading {
		color: white;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		display: flex;
		justify-content: center;
		font-size: 1.5em;
	}

	.sound {
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
	.sound:hover {
		background-color: #357ec7;
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

	.note {
		font-size: 0.8em;
		color: white;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		margin-top: 5px;
		margin-bottom: 5px;
		padding-left: 10px;
		padding-right: 10px;
	}
</style>
