<script lang="ts">
	import PlanetFilter from '$lib/components/PlanetFilter.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import PlanetSection from '$lib/components/PlanetSection.svelte';
	import SolarSystem from '$lib/components/SolarSystem.svelte';
	import { events, planets } from '$lib/events';
	import { timer } from '$lib/timer.svelte';

	let selectedPlanet = $state('All');

	const planetColors: Record<string, string> = {
		All: '#4fc3f7',
		'Ash Twin': '#f5a623',
		'Ember Twin': '#ff6f00',
		'Brittle Hollow': '#ab47bc',
		'Timber Hearth': '#4caf50',
		"Giant's Deep": '#1976d2',
		Interloper: '#90a4ae',
		'The Stranger': '#8d6e63',
		'Sun Station': '#f44336'
	};

	// Which planets to show sections for
	const visiblePlanets = $derived(
		selectedPlanet === 'All'
			? planets
			: ['All', selectedPlanet]
	);

	// For each visible planet, collect its filtered events
	const planetGroups = $derived(
		visiblePlanets
			.map((planet) => ({
				planet,
				color: planetColors[planet] ?? '#f5f5f5',
				events: events.filter((e) => e.planet === planet)
			}))
			.filter((g) => g.events.length > 0)
	);

	const totalVisible = $derived(planetGroups.reduce((n, g) => n + g.events.length, 0));
</script>

<div class="app">
	<main>
		<div class="content-layout">
			<div class="solar-system-col">
				<SolarSystem />
			</div>

			<section class="events-panel">
				<div class="events-header">
					<PlanetFilter selected={selectedPlanet} onselect={(p) => (selectedPlanet = p)} />
				</div>

				{#if totalVisible === 0}
					<p class="empty">No events match the current filters.</p>
				{:else}
					<div class="planet-grid">
						{#each planetGroups as group (group.planet)}
							<PlanetSection
								planet={group.planet}
								events={group.events}
								color={group.color}
							/>
						{/each}
					</div>
				{/if}
			</section>
		</div>
	</main>
</div>

<Timer />

<style>
	.app {
		padding: 0 var(--space-8);
		padding-bottom: 100px; /* clear the fixed footer */
	}

	/* ── Two-column layout ── */
	.content-layout {
		display: grid;
		grid-template-columns: 1fr minmax(0, 360px);
		gap: var(--space-8);
		align-items: start;
	}

	.solar-system-col {
		position: sticky;
		top: 0;
		height: 100vh;
		padding-bottom: 100px; /* clear timer footer */
	}

	.events-panel { min-width: 0; }

	.planet-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
		align-items: start;
	}

	@media (max-width: 900px) {
		.content-layout {
			grid-template-columns: 1fr;
		}
		.solar-system-col {
			position: static;
			max-width: 480px;
			margin: 0 auto;
			width: 100%;
		}
	}

	/* ── Filters ── */
	.events-header {
		margin-bottom: var(--space-8);
		padding-bottom: var(--space-6);
		border-bottom: 2px solid var(--border);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	/* ── Empty ── */
	.empty {
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--text-dim);
		padding: var(--space-8) 0;
		text-align: center;
		letter-spacing: 0.05em;
	}
</style>
