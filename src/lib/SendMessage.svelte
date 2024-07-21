<script>
	import { sendMessage } from '$lib/sockets/sounds';
	let message = '';
	export let toastWrapper;
</script>

<textarea bind:value={message} class="messageInput" placeholder="Type a message..." />
<p class="note">Note: do not send important messages here! I might not even see these.</p>
<button
	class="sendButton"
	on:click={() => {
		if (!message) return;
		sendMessage(message);
		message = '';
		toastWrapper('Message has been recieved by Danny', 'success');
	}}>Send</button
>

<style>
	.messageInput {
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
		resize: none;
		padding: 1rem;
		font-size: 1.5rem;
	}

	.sendButton {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 2rem;
		background-color: #0078d4;
		color: white;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		border: none;
		cursor: pointer;
	}

	.note {
		position: absolute;
		bottom: 20px;
		right: 0;
		width: 100%;
		font-size: 0.8rem;
		text-align: center;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
</style>
