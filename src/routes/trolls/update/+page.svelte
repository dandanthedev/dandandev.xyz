<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { preloadedAssets } from '$lib/stores.js';

	let percent = 0;
	let overlay = true;
	onMount(async () => {
		if ($preloadedAssets.loading) goto('/');

		await new Promise((r) => setTimeout(r, 1000));
		overlay = false;

		while (percent < 100) {
			percent += Math.random() * 10;
			percent = Math.floor(percent);
			await new Promise((r) => setTimeout(r, Math.random() * 2000));

			if (Math.random() < 0.01) percent = 100;
		}
		await new Promise((r) => setTimeout(r, 3000));

		overlay = true;
		await new Promise((r) => setTimeout(r, 1000));

		goto('/');
	});
</script>

{#if overlay}
	<div class="overlay" />
{/if}

<div class="bg">
	<span class="loader"></span>
	<h2 class="text">
		{#if percent < 100}
			Working on updates<br />
			{percent}% complete<br />
			Don't turn off your computer
		{:else}
			Restarting...
		{/if}
	</h2>
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
		justify-content: center;
		flex-direction: column;
	}
	.loader {
		color: #ffffff;
		font-size: 45px;
		text-indent: -9999em;
		overflow: hidden;
		width: 1em;
		height: 1em;
		border-radius: 50%;
		position: relative;
		transform: translateZ(0);
		animation:
			mltShdSpin 1.7s infinite ease,
			round 1.7s infinite ease;
	}

	@keyframes mltShdSpin {
		0% {
			box-shadow:
				0 -0.83em 0 -0.4em,
				0 -0.83em 0 -0.42em,
				0 -0.83em 0 -0.44em,
				0 -0.83em 0 -0.46em,
				0 -0.83em 0 -0.477em;
		}
		5%,
		95% {
			box-shadow:
				0 -0.83em 0 -0.4em,
				0 -0.83em 0 -0.42em,
				0 -0.83em 0 -0.44em,
				0 -0.83em 0 -0.46em,
				0 -0.83em 0 -0.477em;
		}
		10%,
		59% {
			box-shadow:
				0 -0.83em 0 -0.4em,
				-0.087em -0.825em 0 -0.42em,
				-0.173em -0.812em 0 -0.44em,
				-0.256em -0.789em 0 -0.46em,
				-0.297em -0.775em 0 -0.477em;
		}
		20% {
			box-shadow:
				0 -0.83em 0 -0.4em,
				-0.338em -0.758em 0 -0.42em,
				-0.555em -0.617em 0 -0.44em,
				-0.671em -0.488em 0 -0.46em,
				-0.749em -0.34em 0 -0.477em;
		}
		38% {
			box-shadow:
				0 -0.83em 0 -0.4em,
				-0.377em -0.74em 0 -0.42em,
				-0.645em -0.522em 0 -0.44em,
				-0.775em -0.297em 0 -0.46em,
				-0.82em -0.09em 0 -0.477em;
		}
		100% {
			box-shadow:
				0 -0.83em 0 -0.4em,
				0 -0.83em 0 -0.42em,
				0 -0.83em 0 -0.44em,
				0 -0.83em 0 -0.46em,
				0 -0.83em 0 -0.477em;
		}
	}

	@keyframes round {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.text {
		font-family: 'Segoe UI Light', Tahoma, Geneva, Verdana, sans-serif;
		font-weight: 100;
		font-size: 1.5em;
		color: #ffffff;
		text-align: center;
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
</style>
