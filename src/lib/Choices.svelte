<script>
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import { fade, fly, draw } from 'svelte/transition';
	import { goto } from '$app/navigation';
	let thing1 = '';
	let thing2 = '';
	let thing1Percentages;
	let thing2Percentages;
	let voting = false;
	let out = true;

	const choicesAPI = 'https://choices.daanschenkel.nl'; // TODO: env

	async function random() {
		let preload1 = new Image();
		let preload2 = new Image();

		voting = false;
		thing1Percentages = null;
		thing2Percentages = null;
		const response = await fetch(`${choicesAPI}/random`);
		const data = await response.json();

		//preload images
		preload1.src = `${choicesAPI}/${data.item1.replaceAll(' ', '_').toLowerCase()}.png`;
		preload2.src = `${choicesAPI}/${data.item2.replaceAll(' ', '_').toLowerCase()}.png`;

		//wait for images to load
		await new Promise((resolve) => {
			let loaded = 0;
			preload1.onload = () => {
				loaded++;
				if (loaded === 2) {
					resolve();
				}
			};
			preload2.onload = () => {
				loaded++;
				if (loaded === 2) {
					resolve();
				}
			};
		});

		thing1 = data.item1;
		thing2 = data.item2;
	}

	async function vote(item) {
		voting = true;
		const params = new URLSearchParams();
		params.append('choice', item);
		params.append('other', item === thing1 ? thing2 : thing1);
		const response = await fetch(`${choicesAPI}/choice?${params.toString()}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ item })
		});
		const data = await response.json();

		if (item === thing1) {
			thing1Percentages = data.chosenPercentage === null ? 0 : data.chosenPercentage;
			thing2Percentages = data.otherPercentage === null ? 0 : data.otherPercentage;
		} else {
			thing2Percentages = data.chosenPercentage === null ? 0 : data.chosenPercentage;
			thing1Percentages = data.otherPercentage === null ? 0 : data.otherPercentage;
		}

		console.log(thing1Percentages, thing2Percentages);
	}

	async function load() {
		if (typeof document === 'undefined') {
			return;
		}
		await random();
		out = false;
	}

	load();
</script>

{#if out}
	<div class="transition" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}></div>
{/if}
<!-- <a
	href="/thingbattle/results"
	class="results"
	on:click|preventDefault={() => {
		out = true;
		setTimeout(() => {
			goto('/thingbattle/results');
		}, 500);
	}}><button>Results</button></a
> -->

<div class="divider">
	<button
		class="thing"
		style="background-image: url('{choicesAPI}/{thing1.replaceAll(' ', '_').toLowerCase()}.png')"
		on:click={() => vote(thing1)}
		disabled={voting}
	>
		<div class="thing-overlay">
			<h1>{thing1}</h1>
			{#if thing1Percentages !== null}
				<h2 in:fly={{ duration: 200, y: 50 }} out:fly={{ duration: 200, y: 50 }}>
					{thing1Percentages}%
				</h2>
			{/if}
		</div>
	</button>

	<div class="or">
		{#if !thing1Percentages && !thing2Percentages}
			<h1 in:fly={{ x: -100, duration: 200, delay: 201 }} out:fly={{ x: -100, duration: 200 }}>
				{#if thing1 && thing2}
					or
				{:else}
					Loading...
				{/if}
			</h1>
		{:else}
			<button
				on:click={random}
				class="next"
				in:fly={{ x: 100, duration: 200, delay: 201 }}
				out:fly={{ x: 100, duration: 200 }}>Next</button
			>
		{/if}
	</div>
	<button
		class="thing"
		style="background-image: url('{choicesAPI}/{thing2.replaceAll(' ', '_').toLowerCase()}.png')"
		on:click={() => vote(thing2)}
		disabled={voting}
	>
		<div class="thing-overlay">
			<h1>{thing2}</h1>
			{#if thing2Percentages !== null}
				<h2 in:fly={{ duration: 200, y: 50 }} out:fly={{ duration: 200, y: 50 }}>
					{thing2Percentages}%
				</h2>
			{/if}
		</div>
	</button>
</div>

<style>
	.divider {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.thing {
		width: calc(50% - 1px);
		height: 100%;
		background-size: cover;
		background-position: center;
		position: relative;

		transition: 1s;
	}
	.thing-overlay {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		color: white;
	}

	.thing-overlay h1 {
		font-size: 3em;
		margin: 0;

		text-align: center;

		/*crossfade text on change*/
		transition: 0.5s;
	}
	.thing-overlay h2 {
		font-size: 2em;
		margin: 0;
	}
	h1 {
		margin: 0;
	}

	.choose {
		text-align: center;
		font-size: 4em;
		position: absolute;
		top: 30px;
		left: 0;
		z-index: 1;
		font-weight: bold;
		font-family: 'Arial';
		color: white;
		text-align: center;
		width: 100%;
	}

	.choose p {
		font-size: 0.5em;
	}

	.or {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 2em;
		color: white;
		z-index: 1;
		font-weight: bold;
		font-family: 'Arial';

		display: flex;
		justify-content: space-between;
	}

	.thing h2 {
		font-size: 1.5em;
	}

	.next {
		font-size: 0.5em;
		padding: 0.5em 1em;
		border: none;
		background: white;
		color: black;
		font-weight: bold;
		cursor: pointer;
		border-radius: 5px;
	}

	/* @media (max-width: 768px) {
		.divider {
			flex-direction: column;
		}
		.thing {
			width: 100%;
			height: 50vh;
		}
		.choose {
			top: 5%;
			transform: translate(-50%, 0);
			font-size: 3em;
			width: 100%;
			text-align: center;
		}

		.choose p {
			display: none;
		}

		.or {
			top: 50%;
			transform: translate(-50%, -50%);
		}

		.thing-overlay h1 {
			font-size: 2em;
		}
		.thing-overlay h2 {
			font-size: 1.5em;
		}

		
		.back {
			margin-top: 100px;
		}
		.results {
			margin-top: 100px;
		}
	} */

	.results {
		position: absolute;
		color: white;
		top: 0;
		right: 0;
		padding: 1em;
		z-index: 1;
		font-size: 1.5em;
		font-weight: bold;
		font-family: 'Arial';
	}

	.transition {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: black;
		z-index: 100;
	}
</style>
