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

	const color = $derived(planetColors[event.planet] ?? '#f5f5f5');
</script>

<div
	class="event-row"
	class:past={status === 'past'}
	class:active={status === 'active'}
	class:upcoming={status === 'upcoming'}
>
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
			<span class="time-stamp" style="--color: {color}">{formatTime(event.timeSeconds)}</span>
			{#if event.ongoing && event.endSeconds}
				<span class="time-end">→ {formatTime(event.endSeconds)}</span>
			{/if}
			<span class="planet-tag" style="--color: {color}">{event.planet}</span>
			{#if status === 'active' && event.ongoing}
				<span class="ongoing-tag">ONGOING</span>
			{/if}
		</div>

		<h3 class="title">{event.title}</h3>
		<p class="description">{event.description}</p>
	</div>
</div>

<style>
	.event-row {
		display: flex;
		gap: var(--space-4);
		transition: opacity 0.3s ease;
	}

	.event-row.past     { opacity: 0.28; }
	.event-row.upcoming { opacity: 0.75; }
	.event-row.active   { opacity: 1; }

	/* ── Timeline ── */
	.timeline {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-shrink: 0;
		padding-top: 3px;
	}

	.dot {
		position: relative;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--color);
		flex-shrink: 0;
		z-index: 1;
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
		inset: -5px;
		border-radius: 50%;
		background: var(--color);
		opacity: 0.25;
		animation: pulse 1.6s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); opacity: 0.25; }
		50%       { transform: scale(2); opacity: 0; }
	}

	.line {
		width: 2px;
		flex: 1;
		min-height: var(--space-6);
		background: var(--border);
		margin: var(--space-1) 0;
	}

	.line.filled { background: var(--border-light); }

	/* ── Card ── */
	.card {
		flex: 1;
		padding-bottom: var(--space-6);
		padding-left: var(--space-3);
		border-left: 2px solid transparent;
		transition: border-color 0.3s ease, background 0.3s ease;
		border-radius: 0 var(--radius) var(--radius) 0;
	}

	.event-row.active .card {
		border-left-color: var(--warning);
		background: rgba(217, 119, 6, 0.04);
		padding-right: var(--space-3);
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
		margin-bottom: var(--space-2);
	}

	.time-stamp {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color);
		letter-spacing: 0.04em;
	}

	.time-end {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--text-dim);
	}

	.planet-tag {
		font-family: var(--font-body);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color);
		background: color-mix(in srgb, var(--color) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--color) 28%, transparent);
		padding: 2px 6px;
		border-radius: var(--radius);
	}

	.ongoing-tag {
		font-family: var(--font-body);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--primary);
		background: rgba(0, 119, 188, 0.1);
		border: 1px solid rgba(0, 119, 188, 0.3);
		padding: 2px 6px;
		border-radius: var(--radius);
		animation: blink 2s ease-in-out infinite;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50%       { opacity: 0.45; }
	}

	.title {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 400; /* Archivo Black is already heavy */
		color: var(--text);
		margin: 0 0 var(--space-2);
		line-height: 1.3;
		transition: color 0.3s ease;
	}

	.event-row.past .title   { color: var(--text-muted); }
	.event-row.active .title { color: #ffffff; }

	.description {
		font-family: var(--font-body);
		font-size: 0.82rem;
		font-weight: 400;
		color: var(--text-muted);
		line-height: 1.6;
		margin: 0;
	}
</style>
