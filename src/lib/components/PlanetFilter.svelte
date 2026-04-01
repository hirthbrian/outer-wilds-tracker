<script lang="ts">
	import { planets } from '$lib/events';

	interface Props {
		selected: string;
		onselect: (planet: string) => void;
	}

	let { selected, onselect }: Props = $props();

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
</script>

<div class="filter-bar">
	<span class="filter-label">PLANET</span>
	<div class="filter-buttons">
		{#each planets as planet}
			<button
				class="filter-btn"
				class:active={selected === planet}
				onclick={() => onselect(planet)}
				style="--planet-color: {planetColors[planet] ?? '#f5f5f5'}"
			>
				<span class="dot"></span>
				{planet}
			</button>
		{/each}
	</div>
</div>

<style>
	.filter-bar {
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

	.filter-buttons {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.filter-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		height: 32px;
		padding: 0 var(--space-3);
		border-radius: var(--radius);
		font-family: var(--font-body);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		cursor: pointer;
		border: 2px solid var(--border);
		background: transparent;
		color: var(--text-muted);
		transition: all 0.12s ease;
	}

	.filter-btn:hover {
		border-color: var(--planet-color);
		color: var(--text);
	}

	.filter-btn:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	.filter-btn.active {
		border-color: var(--planet-color);
		background: color-mix(in srgb, var(--planet-color) 14%, transparent);
		color: var(--text);
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--planet-color);
		opacity: 0.5;
		transition: opacity 0.12s ease;
		flex-shrink: 0;
	}

	.filter-btn.active .dot,
	.filter-btn:hover .dot {
		opacity: 1;
	}
</style>
