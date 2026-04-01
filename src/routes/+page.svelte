<script lang="ts">
	import Timer from '$lib/components/Timer.svelte';
	import PlanetFilter from '$lib/components/PlanetFilter.svelte';
	import EventCard from '$lib/components/EventCard.svelte';
	import { events, categories, getEventStatus, type EventCategory } from '$lib/events';
	import { timer } from '$lib/timer.svelte';

	let selectedPlanet = $state('All');
	let selectedCategories = $state(new Set<EventCategory>());

	const filteredEvents = $derived(() => {
		return events.filter((e) => {
			const planetMatch =
				selectedPlanet === 'All' || e.planet === selectedPlanet || e.planet === 'All';
			const categoryMatch =
				selectedCategories.size === 0 || selectedCategories.has(e.category);
			return planetMatch && categoryMatch;
		});
	});

	function toggleCategory(cat: EventCategory) {
		const next = new Set(selectedCategories);
		if (next.has(cat)) next.delete(cat);
		else next.add(cat);
		selectedCategories = next;
	}

	const categoryColors: Record<EventCategory, string> = {
		milestone: '#4fc3f7',
		warp: '#ce93d8',
		character: '#a5d6a7',
		location: '#f5a623',
		environmental: '#80cbc4',
		critical: '#f44336'
	};
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

				<div class="events-list">
					{#each filteredEvents() as event, i (event.id)}
						<EventCard
							{event}
							status={getEventStatus(event, timer.elapsed)}
							isLast={i === filteredEvents().length - 1}
						/>
					{/each}

					{#if filteredEvents().length === 0}
						<p class="empty">No events match the current filters.</p>
					{/if}
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
		.header-note { display: none; }
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
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.category-filter {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.filter-label {
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.15em;
		color: var(--text-dim);
		flex-shrink: 0;
	}

	.category-buttons {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.cat-btn {
		padding: 0.25rem 0.7rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--text-muted);
		transition: all 0.15s ease;
		font-family: inherit;
		letter-spacing: 0.02em;
	}

	.cat-btn:hover {
		border-color: var(--cat-color);
		color: var(--text);
	}

	.cat-btn.active {
		border-color: var(--cat-color);
		background: color-mix(in srgb, var(--cat-color) 15%, transparent);
		color: var(--text);
	}

	.events-list {
		display: flex;
		flex-direction: column;
	}

	.empty {
		color: var(--text-dim);
		font-size: 0.875rem;
		padding: 2rem 0;
		text-align: center;
	}
</style>
