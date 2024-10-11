<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let show = true;
	let timeout;

	onMount(() => {
		timeout = setTimeout(() => {
			show = false;
		}, 51000);

		return () => {
			clearTimeout(timeout);
		};
	});
</script>

{#if show}
	<p class="credits" out:fade={{ duration: 1000 }}>
		<b class="title">Credits</b><br />
		Made by Danny (me :D)<br />
		With a little help from <a href="https://github.com/oscarnow">Oscar</a><br />
		<br />
		<b>Things used to run this:</b>
		<br />
		<a href="https://kit.svelte.dev/">Svelte(kit)</a> - The framework this site is built on<br />
		<a href="https://socket.io">Socket.io</a> - For real-time communication (sounds)<br />
		<a href="https://cloudflare.com">Cloudflare</a> - Keeping my site online<br />
		<a href="https://fontawesome.com">Font Awesome</a> (+svelte-fa) - For the icons<br />
		<a href="https://railway.app?referralCode=x93oY2">Railway</a> - for hosting the backends<br />
		<a href="https://svelte-french-toast.com/">Svelte French Toast</a> - For the notifications<br />
		<a href="https://www.google.com/recaptcha">reCAPTCHA</a> - Googles dataminer that i couldn't
		find an alternative for<br />
		<a href="https://neodrag.dev">NeoDrag</a> - For the draggable windows<br />
		<a href="https://expressjs.com/">Express</a> - For the backend(s)<br />
		<a href="https://trpc.io">TRPC</a> - i didnt actually end up using this but omg i need to<br />
		<br /><br />
		<b class="legal"
			>All images, names, etc used on this site are property of their respective authors. I am not
			and do not pretend to be Google, GitHub, LinkedIn, Microsoft or any other company/trademark
			used on this website.
		</b>
	</p>
{:else}
	<div class="thanks" in:fade={{ duration: 1000, delay: 1000 }}>
		Thanks for visiting and have a nice day!<br />
		- Danny
	</div>
{/if}

<style>
	@keyframes creditsRoll {
		0% {
			transform: translateY(20%);
		}
		98% {
			transform: translateY(-100%);
			opacity: 1;
		}
		100% {
			transform: translateY(-100%);
			opacity: 0;
		}
	}

	.credits {
		font-family: 'Press Start 2P', cursive;
		font-size: 1.5em;
		color: black;
		text-align: center;
		animation: creditsRoll 51s linear;
		z-index: -1;
	}

	.title {
		font-size: 2em;
	}

	.legal {
		font-size: 0.8em;
	}

	.thanks {
		font-size: 1.2em;
		text-align: center;
		font-family: 'Press Start 2P', cursive;
		font-size: 1.5em;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
</style>
