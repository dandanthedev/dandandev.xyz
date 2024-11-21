<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { preloadedAssets } from '$lib/stores.js';

	let overlay = true;
	let video;
	onMount(async () => {
		if ($preloadedAssets.loading) goto('/');

		video.muted = true;
		video.play();

		await new Promise((r) => setTimeout(r, 4000));
		overlay = false;
	});
</script>

{#if overlay}
	<div class="overlay" out:fade={{ duration: 1000 }} in:fade={{ duration: 500 }}>
		<video class="video" bind:this={video}>
			<source src={$preloadedAssets.win11vid} type="video/mp4" />
		</video>
	</div>
{/if}

<div class="bg">
	<h2 class="text">Microsoft recommends upgrading to Windows 11</h2>
	<img src={$preloadedAssets.win11img} alt="Windows 11" class="screenshot" />

	<p class="bulletPoints">
		<span class="bulletPoint">• Less privacy</span>
		<span class="bulletPoint">• More spyware</span>
		<span class="bulletPoint">• Centered taskbar</span>
	</p>

	<div class="buttons">
		<button
			class="accept"
			on:click={() => {
				alert('wait, you actually want win11? we havent coded that functionality yet');
			}}>Accept upgrade!</button
		>
		<a
			href="/"
			class="deny"
			on:click|preventDefault={async () => {
				overlay = true;
				await new Promise((r) => setTimeout(r, 1000));
				goto('/');
			}}
		>
			Stick with Windows 10 (for now)
		</a>
	</div>
</div>

<style>
	.bg {
		background-color: #005a9e;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 20;
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.text {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-weight: 400;
		font-size: 2em;
		color: #ffffff;
		text-align: center;
		margin-top: 100px;
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: black;
		z-index: 30;
	}

	.screenshot {
		width: 80%;
		max-width: 700px;
		border-radius: 20px;
		box-shadow: 0 0 10px #000000;
	}

	.bulletPoints {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-weight: 400;
		font-size: 1.5em;
		color: #ffffff;
		text-align: center;
		margin-top: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		max-width: 800px;
		width: 100%;
	}

	.bulletPoint {
		margin: 0 10px;
		width: 100%;
	}

	.buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: 20px;
	}

	.accept {
		background-color: #0078d4;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 5px;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-weight: 400;
		font-size: 1.2em;
		cursor: pointer;
	}

	.deny {
		text-decoration: none;
		color: #ffffff;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-weight: 400;
		margin-top: 10px;
		font-size: 0.7em;
	}

	.video {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
		width: 100%;
		height: 100%;

		object-fit: cover;
	}
</style>
