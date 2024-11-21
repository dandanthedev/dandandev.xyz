<script>
	import {
		faBicycle,
		faCode,
		faDroplet,
		faFire,
		faGlobe,
		faHand,
		faHeart,
		faImage,
		faMicrophone,
		faNewspaper,
		faRadio,
		faStar
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	const projects = [
		{
			name: 'Starling Days',
			description: 'Designed and created a band website for the band "Starling Days".',
			url: 'https://starlingdays.com',
			icon: faStar
		},

		{
			name: 'Karen.pics',
			description: 'A website where people can upload images and share them easily.',
			url: 'https://karen.pics',
			icon: faImage
		},

		{
			name: 'P.E.T.S',
			description: 'Made and maintains the online learning environment and website for P.E.T.S.',
			url: 'https://petsproject.nl',
			icon: faHand
		},
		{
			name: 'VIPS TV',
			description: 'Made and maintains the website for VIPS TV.',
			url: 'https://vipstv.nl',
			icon: faStar
		},
		{
			name: 'is-a.dev',
			description: 'Developed an open-source register site, linked with analytics and web hosting. (NO LONGER ACTIVE)',
			url: 'https://manage.is-a.dev',
			icon: faGlobe
		},
		{
			name: 'League-FM',
			description: 'Wrote the internal management system and the backend for the public site.',
			url: 'https://league-fm.nl',
			icon: faRadio
		},
		{
			name: 'Fit in a Box',
			description:
				'Developed an app for Fit in a Box, a company that makes custom boxes to keep you fit.',
			url: 'https://fitinabox.app',
			icon: faHeart
		},
		{
			name: 'Hexi Development',
			description:
				'Developed multiple applications & reverse-engineered APIs for Hexi Development.',

			url: 'https://hexidev.nl',
			icon: faCode
		},
		{
			name: 'LangsteStream.nl',
			description:
				"Made an interactive app for Dutch livestreamer <a href='https://twitch.tv/henRYANand'>henRYANand</a> that i developed for April fools 2024. It allowed users to upload short videos, that would then be processed and placed in a long stream.",
			url: 'https://langstestream.nl',
			icon: faDroplet
		},
		{
			name: 'StreamStreaks.com',
			description: `Developed an app in partnership with twitch streamer <a href="https://twitch.tv/henRYANand">henRYANand</a> that allows users to have streaks in streamers chats, to keep them active and engaged.`,
			url: 'https://streamstreaks.com',
			icon: faFire
		},
		{
			name: 'CrewHL.nl',
			description: `Made an internal app integrated with WhatsApp and the user's school schedules, to manage the schools music crew administration.`,
			url: 'https://crewhl.nl',
			icon: faMicrophone
		},
		{
			name: 'WikiGame',
			description: `I like to play games with my friends, and recently discovered Wikipedia speedrun games. I did find them a bit annoying to use though, so i decided to make my own.<br/>
			<br/>It's simple, just name, code, article, play!`,
			url: 'https://wikigame.dandandev.xyz',
			icon: faNewspaper
		}
	];
	export let openWindow;
</script>

<div class="container">
	{#each projects as project}
		<button
			class="item"
			on:click={() => {
				openWindow({
					component: 'Text',
					title: project.name,
					height: 230,
					icon: project.icon,
					passToComponent: {
						text: project.description,
						buttons: [
							{
								text: 'Visit website',
								action: () => {
									window.open(project.url);
								}
							}
						],
						allowHTML: true
					}
				});
			}}
		>
			<span class="icon">
				<Fa icon={project.icon} size="2x" />
			</span>
			<p class="name">{project.name}</p>
		</button>
	{/each}
	<div class="spacer" />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		margin-top: 1rem;

		/*enable scrolling*/
		overflow-y: auto;
		height: 100%;
		scrollbar-width: thin;
		scrollbar-color: var(--color-bg-3) var(--color-bg-2);
	}
	.item {
		display: flex;
		gap: 0.5rem;
		border-radius: 0.5rem;
		background-color: var(--color-bg-2);
		transition: background-color 0.2s;
		align-items: center;
		color: black;
		text-decoration: none;
		border: none;
		cursor: pointer;
	}
	.item:hover {
		background-color: var(--color-bg-3);
	}
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.name {
		font-size: 1rem;
	}

	.spacer {
		margin-bottom: 2rem;
	}
</style>
