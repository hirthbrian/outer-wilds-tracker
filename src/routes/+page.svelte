<script lang="ts">
	import Timer from '$lib/components/Timer.svelte';
	import PlanetFilter from '$lib/components/PlanetFilter.svelte';
	import EventCard from '$lib/components/EventCard.svelte';
	import { events, getEventStatus } from '$lib/events';
	import { timer } from '$lib/timer.svelte';

	let selectedPlanet = $state('All');

	const filteredEvents = $derived(
		selectedPlanet === 'All'
			? events
			: events.filter((e) => e.planet === selectedPlanet || e.planet === 'All')
	);
</script>

<div class="app">
	<header>
		<div class="header-inner">
			<div class="title-group">
				<h1>Outer Wilds Tracker</h1>
				<p class="subtitle">22-minute loop event timeline</p>
			</div>
			<div class="header-note">
				Run alongside your game to track timed events across the solar system.
			</div>
		</div>
	</header>

	<main>
		<div class="layout">
			<aside class="sidebar">
				<div class="sticky-panel">
					<Timer />
				</div>
			</aside>

			<section class="events-panel">
				<div class="events-header">
					<PlanetFilter selected={selectedPlanet} onselect={(p) => (selectedPlanet = p)} />
				</div>

				<div class="events-list">
					{#each filteredEvents as event, i (event.id)}
						<EventCard
							{event}
							status={getEventStatus(event, timer.elapsed)}
							isLast={i === filteredEvents.length - 1}
						/>
					{/each}
				</div>
			</section>
		</div>
	</main>
</div>

<style>
	.app {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	header {
		padding: 2.5rem 0 2rem;
		border-bottom: 1px solid var(--border);
		margin-bottom: 2rem;
	}

	.header-inner {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 2rem;
		flex-wrap: wrap;
	}

	h1 {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--text);
		letter-spacing: -0.02em;
		margin-bottom: 0.2rem;
	}

	.subtitle {
		font-size: 0.8rem;
		color: var(--text-dim);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-family: var(--font-mono);
	}

	.header-note {
		font-size: 0.82rem;
		color: var(--text-muted);
		max-width: 300px;
		text-align: right;
		line-height: 1.4;
	}

	@media (max-width: 640px) {
		.header-note {
			display: none;
		}
	}

	.layout {
		display: grid;
		grid-template-columns: 380px 1fr;
		gap: 3rem;
		align-items: start;
	}

	@media (max-width: 900px) {
		.layout {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}

	.sticky-panel {
		position: sticky;
		top: 1.5rem;
	}

	.events-panel {
		min-width: 0;
	}

	.events-header {
		margin-bottom: 1.75rem;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid var(--border);
	}

	.events-list {
		display: flex;
		flex-direction: column;
	}
</style>
