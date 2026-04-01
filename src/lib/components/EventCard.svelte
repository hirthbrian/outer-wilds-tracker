<script lang="ts">
	import { type OWEvent, type EventStatus } from '$lib/events';

	interface Props {
		event: OWEvent;
		status: EventStatus;
		isLast: boolean;
	}

	let { event, status, isLast }: Props = $props();

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

	function formatTime(s: number): string {
		const m = Math.floor(s / 60);
		const sec = s % 60;
		return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
	}

	const color = $derived(planetColors[event.planet] ?? '#e8e0cc');
</script>

<div class="event-row" class:past={status === 'past'} class:active={status === 'active'} class:upcoming={status === 'upcoming'}>
	<div class="timeline">
		<div class="dot" style="--color: {color}">
			{#if status === 'active'}
				<div class="dot-pulse" style="--color: {color}"></div>
			{/if}
		</div>
		{#if !isLast}
			<div class="line" class:filled={status === 'past'}></div>
		{/if}
	</div>

	<div class="card">
		<div class="card-header">
			<span class="time-badge" style="--color: {color}">{formatTime(event.timeSeconds)}</span>
			{#if event.ongoing && event.endSeconds}
				<span class="duration-badge">→ {formatTime(event.endSeconds)}</span>
			{/if}
			<span class="planet-badge" style="--color: {color}">{event.planet}</span>
			{#if status === 'active' && event.ongoing}
				<span class="ongoing-badge">ONGOING</span>
			{/if}
		</div>

		<h3 class="title">{event.title}</h3>
		<p class="description">{event.description}</p>
	</div>
</div>

<style>
	.event-row {
		display: flex;
		gap: 1rem;
		transition: opacity 0.4s ease;
	}

	.event-row.past {
		opacity: 0.35;
	}

	.event-row.active {
		opacity: 1;
	}

	.event-row.upcoming {
		opacity: 0.8;
	}

	/* Timeline column */
	.timeline {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-shrink: 0;
		padding-top: 0.2rem;
	}

	.dot {
		position: relative;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--color);
		flex-shrink: 0;
		z-index: 1;
		transition: transform 0.2s ease;
	}

	.event-row.past .dot {
		background: var(--border-light);
	}

	.event-row.upcoming .dot {
		background: transparent;
		border: 2px solid var(--color);
		opacity: 0.5;
	}

	.dot-pulse {
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		background: var(--color);
		opacity: 0.3;
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); opacity: 0.3; }
		50% { transform: scale(1.8); opacity: 0; }
	}

	.line {
		width: 2px;
		flex: 1;
		min-height: 1.5rem;
		background: var(--border);
		margin: 4px 0;
	}

	.line.filled {
		background: var(--border-light);
	}

	/* Card */
	.card {
		flex: 1;
		padding-bottom: 1.5rem;
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 0.4rem;
	}

	.time-badge {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color);
	}

	.duration-badge {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-dim);
	}

	.planet-badge {
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		color: var(--color);
		background: color-mix(in srgb, var(--color) 12%, transparent);
		border: 1px solid color-mix(in srgb, var(--color) 30%, transparent);
		padding: 0.1em 0.55em;
		border-radius: 4px;
		text-transform: uppercase;
	}

	.ongoing-badge {
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--cyan);
		background: rgba(79, 195, 247, 0.1);
		border: 1px solid rgba(79, 195, 247, 0.3);
		padding: 0.1em 0.55em;
		border-radius: 4px;
		animation: badge-blink 2s ease-in-out infinite;
	}

	@keyframes badge-blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	.title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text);
		margin: 0 0 0.3rem;
		transition: color 0.3s ease;
	}

	.event-row.active .title {
		color: #fff;
	}

	.event-row.past .title {
		color: var(--text-muted);
	}

	.description {
		font-size: 0.85rem;
		color: var(--text-muted);
		line-height: 1.55;
		margin: 0;
	}

	/* Active card highlight */
	.event-row.active .card {
		position: relative;
	}

	.event-row.active .card::before {
		content: '';
		position: absolute;
		left: -1rem;
		top: 0;
		bottom: 0;
		width: 2px;
		background: linear-gradient(to bottom, transparent, var(--accent), transparent);
		border-radius: 2px;
	}
</style>
