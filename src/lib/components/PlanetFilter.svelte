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
	<span class="filter-label">FILTER</span>
	<div class="filter-buttons">
		{#each planets as planet}
			<button
				class="filter-btn"
				class:active={selected === planet}
				onclick={() => onselect(planet)}
				style="--planet-color: {planetColors[planet] ?? '#e8e0cc'}"
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

	.filter-buttons {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.filter-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.85rem;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--text-muted);
		transition: all 0.15s ease;
		font-family: inherit;
	}

	.filter-btn:hover {
		border-color: var(--planet-color);
		color: var(--text);
	}

	.filter-btn.active {
		border-color: var(--planet-color);
		background: color-mix(in srgb, var(--planet-color) 12%, transparent);
		color: var(--text);
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--planet-color);
		opacity: 0.5;
		transition: opacity 0.15s ease;
		flex-shrink: 0;
	}

	.filter-btn.active .dot,
	.filter-btn:hover .dot {
		opacity: 1;
	}
</style>
