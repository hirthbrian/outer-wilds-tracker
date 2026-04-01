<script lang="ts">
	import PlanetFilter from '$lib/components/PlanetFilter.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import PlanetSection from '$lib/components/PlanetSection.svelte';
	import { events, planets, categories, type EventCategory } from '$lib/events';
	import { timer } from '$lib/timer.svelte';

	let selectedPlanet = $state('All');
	let selectedCategories = $state(new Set<EventCategory>());

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

	const categoryColors: Record<EventCategory, string> = {
		milestone:     '#4fc3f7',
		warp:          '#ce93d8',
		character:     '#a5d6a7',
		location:      '#f5a623',
		environmental: '#80cbc4',
		critical:      '#f44336'
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
				events: events.filter(
					(e) =>
						e.planet === planet &&
						(selectedCategories.size === 0 || selectedCategories.has(e.category))
				)
			}))
			.filter((g) => g.events.length > 0)
	);

	function toggleCategory(cat: EventCategory) {
		const next = new Set(selectedCategories);
		if (next.has(cat)) next.delete(cat);
		else next.add(cat);
		selectedCategories = next;
	}

	const totalVisible = $derived(planetGroups.reduce((n, g) => n + g.events.length, 0));
</script>

<div class="app">
	<header>
		<div class="header-inner">
			<div class="title-group">
				<h1>Outer Wilds<br />Tracker</h1>
				<p class="subtitle">22-MINUTE LOOP · EVENT TIMELINE</p>
			</div>
			<p class="header-note">
				Run alongside your game to track timed events across the solar system.
			</p>
		</div>
	</header>

	<main>
		<section class="events-panel">
			<div class="events-header">
					<PlanetFilter selected={selectedPlanet} onselect={(p) => (selectedPlanet = p)} />

					<div class="category-filter">
						<span class="filter-label">TYPE</span>
						<div class="category-buttons">
							{#each categories as cat}
								<button
									class="cat-btn"
									class:active={selectedCategories.has(cat.value)}
									onclick={() => toggleCategory(cat.value)}
									style="--cat-color: {categoryColors[cat.value]}"
								>
									{cat.label}
								</button>
							{/each}
						</div>
					</div>
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
	</main>
</div>

<Timer />

<style>
	.app {
		padding: 0 var(--space-8);
		padding-bottom: 100px; /* clear the fixed footer */
	}

	/* ── Header ── */
	header {
		padding: var(--space-8) 0;
		border-bottom: 2px solid var(--border);
		margin-bottom: var(--space-8);
	}

	.header-inner {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--space-8);
		flex-wrap: wrap;
	}

	h1 {
		font-family: var(--font-display);
		font-size: 3rem;
		font-weight: 400;
		color: var(--text);
		line-height: 1.05;
		letter-spacing: -0.02em;
		margin-bottom: var(--space-3);
	}

	.subtitle {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.2em;
		color: var(--text-dim);
	}

	.header-note {
		font-family: var(--font-body);
		font-size: 0.82rem;
		color: var(--text-muted);
		max-width: 260px;
		text-align: right;
		line-height: 1.5;
	}

	@media (max-width: 640px) {
		h1 { font-size: 2.25rem; }
		.header-note { display: none; }
	}

	.events-panel { min-width: 0; }

	.planet-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: var(--space-8);
		align-items: start;
	}

	@media (max-width: 900px) {
		.planet-grid { grid-template-columns: 1fr 1fr; }
	}

	@media (max-width: 560px) {
		.planet-grid { grid-template-columns: 1fr; }
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

	.category-filter {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		flex-wrap: wrap;
	}

	.filter-label {
		font-family: var(--font-body);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		color: var(--text-dim);
		flex-shrink: 0;
	}

	.category-buttons {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.cat-btn {
		display: inline-flex;
		align-items: center;
		height: 28px;
		padding: 0 var(--space-3);
		border-radius: var(--radius);
		font-family: var(--font-body);
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		cursor: pointer;
		border: 2px solid var(--border);
		background: transparent;
		color: var(--text-muted);
		transition: all 0.12s ease;
	}

	.cat-btn:hover { border-color: var(--cat-color); color: var(--text); }
	.cat-btn:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
	.cat-btn.active {
		border-color: var(--cat-color);
		background: color-mix(in srgb, var(--cat-color) 14%, transparent);
		color: var(--text);
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
