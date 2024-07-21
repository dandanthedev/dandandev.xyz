<script>
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	let data = [];
	let out = true;
	let running = false;
	let totalGames = 0;

	const choicesAPI = 'https://choices.daanschenkel.nl'; // TODO: env

	function loadImages() {
		data.map((item) => {
			if (item.loaded) {
				return;
			}
			const el = document.querySelector(
				`[style*="${item.thing.replaceAll(' ', '_').toLowerCase()}.png"]`
			);

			if (el) {
				const rect = el.getBoundingClientRect();
				if (rect.top < window.innerHeight && rect.bottom > 0) {
					//preload
					const img = new Image();
					img.src = `${choicesAPI}/${item.thing.replaceAll(' ', '_').toLowerCase()}.png`;

					img.onload = () => {
						item.loaded = true;
						data = [...data];
					};
				}
			}
		});
	}

	async function load() {
		if (running) {
			return;
		}
		running = true;
		const response = await fetch(`${choicesAPI}/results`);
		data = await response.json();

		totalGames =
			data.reduce((acc, item) => {
				return acc + item.games;
			}, 0) / 2;

		out = false;

		if (typeof window === 'undefined') {
			return;
		}

		//on scroll, load all in view results
		window.addEventListener('scroll', () => {
			loadImages();
		});

		setTimeout(() => {
			loadImages();
		}, 1000);
	}

	load();
</script>

{#if out}
	<div class="transition" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }} />
{/if}

<div class="results">
	{#each data as item}
		<div
			style="background-image: url('{choicesAPI}/{item.thing
				.replaceAll(' ', '_')
				.toLowerCase()}.png"
			class="result"
		>
			<div class="thing-overlay">
				<h2>{item.thing}</h2>
				<p>{item.percentage}%</p>
				{#if item.hover}
					<h3 class="hover" in:fly={{ duration: 200, y: 40 }} out:fly={{ duration: 200, y: 40 }}>
						{item.votes} vote(s), {item.games} game(s)
					</h3>
				{/if}
			</div>
		</div>
	{/each}
</div>

<div class="totalGames">
	<p>Total games: {totalGames}</p>
</div>

<style>
	h1 {
		text-align: center;
		color: white;
		font-size: 3em;
	}
	.result {
		width: 200px;
		height: 200px;
		margin: 10px;
		border-radius: 10px;
		background-size: cover;
		background-position: center;
		position: relative;
		font-family: 'Press Start 2P', cursive;
	}

	.thing-overlay {
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		padding: 10px;
		border-radius: 10px;
	}

	.thing-overlay h2 {
		font-size: 1.8em;
		text-align: center;
		color: white;
		font-weight: bold;
	}

	.thing-overlay p {
		font-size: 1.5em;
		color: white;
	}

	.results {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		width: 100%;
		gap: 20px;
		height: 100%;
		overflow-y: scroll;
	}

	.back {
		position: absolute;
		top: 0;
		left: 0;
		padding: 10px;
	}

	.back button {
		font-size: 2em;
		padding: 10px;
		color: white;
		border: none;
		cursor: pointer;
		transition: 0.3s;
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

	.hover {
		font-size: 1.2em;
		color: white;
		text-align: center;
	}

	.totalGames {
		text-align: center;
		color: white;
		font-size: 2em;
	}

	.totalGames p {
		margin: 0;
	}
</style>
