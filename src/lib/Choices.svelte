<script>
	import { env } from '$env/dynamic/public';
	import { fly } from 'svelte/transition';
	import { Recaptcha, recaptcha } from 'svelte-recaptcha-v2';
	import { jwtDecode } from 'jwt-decode';

	let thing1 = '';
	let thing2 = '';
	let thing1Percentages;
	let thing2Percentages;
	let voting = false;
	let jwt;

	const choicesAPI = env.PUBLIC_CHOICES_API;
	const recapSiteKey = env.PUBLIC_CAPTCHA_KEY;

	async function random() {
		thing1Percentages = null;
		thing2Percentages = null;
		const response = await fetch(`${choicesAPI}/random`);
		if (response.status !== 200) {
			return alert('Error fetching data');
		}
		const text = await response.text();
		const data = jwtDecode(text);

		thing1 = data.options[0];
		thing2 = data.options[1];
		jwt = text;
		voting = false;
	}

	async function vote(item) {
		voting = item;
		recaptcha.execute();
	}

	async function captchaResolved(event) {
		const token = event.detail.token;
		const response = await fetch(`${choicesAPI}/${voting}`, {
			method: 'POST',
			headers: {
				Token: jwt,
				'captcha-response': token
			}
		});
		const data = await response.json();
		if (data?.error) {
			return alert(data?.error);
		}

		if (voting === thing1) {
			thing1Percentages = data[0] === null ? 0 : data[0];
			thing2Percentages = data[1] === null ? 0 : data[1];
		} else {
			thing2Percentages = data[0] === null ? 0 : data[0];
			thing1Percentages = data[1] === null ? 0 : data[1];
		}
	}

	async function load() {
		if (typeof document === 'undefined') {
			return;
		}
		await random();
	}

	load();
</script>

<div class="captcha">
	<Recaptcha
		sitekey={recapSiteKey}
		size={'invisible'}
		on:success={captchaResolved}
		on:error={() => {
			alert('Captcha error');
			voting = false;
		}}
	/>
</div>

<div class="divider">
	{#if thing1}
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
	{/if}

	{#if !thing1Percentages && !thing2Percentages}
		<h1
			class="or"
			class:black={!thing1 && !thing2}
			in:fly={{ x: -100, duration: 200, delay: 201 }}
			out:fly={{ x: -100, duration: 200 }}
		>
			{#if thing1 && thing2}
				or
			{:else}
				Loading...
			{/if}
		</h1>
	{:else}
		<button
			on:click={random}
			class="next or"
			in:fly={{ x: 100, duration: 200, delay: 201 }}
			out:fly={{ x: 100, duration: 200 }}>Next</button
		>
	{/if}

	{#if thing2}
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
	{/if}
</div>

<style>
	.captcha {
		position: absolute;
		bottom: 0;
		right: 0;
		z-index: 1;
	}
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
		cursor: pointer;
	}

	.thing:disabled {
		opacity: 0.8;
		cursor: not-allowed;
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

	.or {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		color: white;
		z-index: 1;
		font-weight: bold;
		font-family: 'Arial';
		font-size: 3em;
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

	.black {
		color: black;
	}
</style>
