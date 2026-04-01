<script lang="ts">
	import EventCard from './EventCard.svelte';
	import { getEventStatus, type OWEvent } from '$lib/events';
	import { timer } from '$lib/timer.svelte';

	interface Props {
		planet: string;
		events: OWEvent[];
		color: string;
	}

	let { planet, events, color }: Props = $props();

	const label = $derived(planet === 'All' ? 'Solar System' : planet);
</script>

<section class="planet-section" style="--color: {color}">
	<div class="planet-header">
		<h2 class="planet-name">{label}</h2>
		<span class="event-count">{events.length} event{events.length !== 1 ? 's' : ''}</span>
	</div>

	<div class="planet-events">
		{#each events as event, i (event.id)}
			<EventCard
				{event}
				status={getEventStatus(event, timer.elapsed)}
				isLast={i === events.length - 1}
			/>
		{/each}
	</div>
</section>

<style>
	.planet-section {
		margin-bottom: var(--space-8);
	}

	/* ── Header ── */
	.planet-header {
		display: flex;
		align-items: baseline;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		margin-bottom: var(--space-4);
		border-left: 3px solid var(--color);
		background: linear-gradient(
			to right,
			color-mix(in srgb, var(--color) 8%, transparent) 0%,
			transparent 60%
		);
		border-radius: 0 var(--radius-md) var(--radius-md) 0;
	}

	.planet-name {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 400;
		color: var(--text);
		line-height: 1;
		letter-spacing: -0.01em;
	}

	.event-count {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		color: var(--color);
		text-transform: uppercase;
	}

	/* ── Events ── */
	.planet-events {
		padding-left: var(--space-4);
		border-left: 2px solid var(--border);
	}
</style>
