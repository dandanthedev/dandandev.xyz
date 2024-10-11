<script>
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	let data = [];
	let out = true;
	let running = false;
	let totalGames = 0;

	const choicesAPI = env.PUBLIC_CHOICES_API;

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
	}

	load();
</script>

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
				<p>{item.votes}/{item.games}</p>
				{#if item.hover}
					<h3 class="hover" in:fly={{ duration: 200, y: 40 }} out:fly={{ duration: 200, y: 40 }}>
						{item.votes} vote(s), {item.games} game(s)
					</h3>
				{/if}
			</div>
		</div>
	{/each}
	<div class="totalGames">
		<p>Total games: {totalGames}</p>
	</div>
</div>

<style>
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

	.hover {
		font-size: 1.2em;
		color: white;
		text-align: center;
	}

	.totalGames {
		text-align: center;
		color: black;
		font-size: 2em;
		width: 100%;
		margin-bottom: 25px;
	}

	.totalGames p {
		margin: 0;
		font-family: 'Press Start 2P', cursive;
	}
</style>
