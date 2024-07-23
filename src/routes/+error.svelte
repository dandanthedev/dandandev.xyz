<script>
	import { page } from '$app/stores';
</script>

<div class="bg">
	<h2 class="sadFace">:(</h2>
	<h1 class="text">{$page.status}</h1>
	<p class="text">
		{$page.error.message}
	</p>

	<a href="/">Go back home</a>
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
	.sadFace {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-weight: 400;
		font-size: 10em;
		color: #ffffff;
		text-align: center;
		margin-top: 100px;
		margin-bottom: 0;
	}

	h1 {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-weight: 400;
		font-size: 3em;
		color: #ffffff;
		text-align: center;
	}
	p {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-weight: 200;
		font-size: 1.5em;
		color: #ffffff;
		text-align: center;
		margin-top: 0;
	}

	a {
		color: #ffffff;
		text-decoration: underline;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-weight: 400;
		font-size: 1.2em;
		margin-top: 50px;
	}
</style>
