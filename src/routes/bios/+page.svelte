<script>
	import { biosSettings } from '$lib/stores.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	let overlay = true;
	let index = -1;
	let editing;
	onMount(() => {
		overlay = false;
		async function handleKeydown(event) {
			if (event.key === 'Enter' && editing) {
				//actually set value
				const key = Object.keys($biosSettings).find(
					(k) => $biosSettings[k].displayName === editing.displayName
				);
				$biosSettings[key].value = editing.value;
				editing = null;
				return;
			}
			if (event.key === 'Escape') {
				if (editing) return (editing = null);
				overlay = true;
				await new Promise((r) => setTimeout(r, 1000)); //wait for fadeout
				goto('/');
			}
			if (event.key === 'ArrowDown') {
				index++;
				if (index >= Object.keys($biosSettings).length) {
					index = 0;
				}
				$biosSettings[Object.keys($biosSettings)[index]].button.focus();
			}
			if (event.key === 'ArrowUp') {
				index--;
				if (index < 0) {
					index = Object.keys($biosSettings).length - 1;
				}
				$biosSettings[Object.keys($biosSettings)[index]].button.focus();
			}

			if (
				event.key === 'ArrowRight' ||
				(event.key === 'ArrowLeft' && document.activeElement.tagName === 'BUTTON')
			) {
				document.activeElement.click();
			}
		}

		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if overlay}
	<div class="overlay" out:fade={{ duration: 100, delay: 1000 }} in:fade={{ duration: 100 }}></div>
{/if}

<div class="bg"></div>
{#if editing}
	<div class="editContainer">
		<h1 tabindex="-1">{editing.displayName}</h1>
		{#if editing.type === 'boolean'}
			<button
				on:click={() => {
					editing.value = !editing.value;
				}}
				autofocus
			>
				[{editing.value ? 'true' : 'false'}]
			</button>
		{/if}
	</div>
{/if}

{#each Object.keys($biosSettings) as key}
	<div class="setting">
		<p tabindex="-1">{$biosSettings[key].displayName}</p>
		<button
			bind:this={$biosSettings[key].button}
			on:click={() => {
				editing = $biosSettings[key];
			}}
		>
			[{$biosSettings[key].value}]
		</button>
	</div>
{/each}

<p class="exit" tabindex="-1">
	Use arrow keys to move<br />Press ENTER to edit<br />Press ESC to exit
</p>

<style>
	* {
		cursor: none;
	}
	.bg {
		background-color: #060098;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}
	@font-face {
		font-family: 'ibm';
		src: url('/ibm.woff') format('woff');
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: black;
		z-index: 10;
	}

	.setting {
		font-family: 'ibm';
		color: white;
		margin: 10px;
		display: flex;
		align-items: center;
		gap: 10px;
		pointer-events: none;
		cursor: none;
	}

	.setting p {
		font-size: 1.2em;
	}

	.exit {
		position: fixed;
		bottom: 10px;
		right: 10px;
		color: white;
		font-family: 'ibm';
		font-size: 1.1em;
		text-align: right;
		pointer-events: none;
	}

	button {
		font-family: 'ibm';
		font-size: 1.2em;
		background-color: black;
		border: none;
		color: white;
	}

	button:focus {
		outline: none;
		background-color: white;
		color: black;
	}

	button:hover {
		background-color: white;
		color: black;
	}

	button:active {
		background-color: black;
		color: white;
	}

	.editContainer {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: black;
		color: white;
		font-family: 'ibm';
		font-size: 1.5em;
		padding: 10px;
		border-radius: 10px;
	}

	.editContainer h1 {
		font-size: 1em;
	}

	.editContainer button {
		font-family: 'ibm';
		margin-left: auto;
		margin-right: auto;
		display: block;
		padding: 10px;
	}
</style>
