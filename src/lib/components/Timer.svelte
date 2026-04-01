<script lang="ts">
	import { timer } from '$lib/timer.svelte';
	import { LOOP_DURATION } from '$lib/events';

	function onSeek(e: Event) {
		const input = e.target as HTMLInputElement;
		timer.seek(Number(input.value));
	}
</script>

<div class="timer" class:end-times={timer.isEndTimes} class:supernova={timer.isSupernova}>
	<div class="timer-header">
		<span class="label">LOOP TIMER</span>
		{#if timer.isEndTimes}
			<span class="warning-badge">END TIMES</span>
		{/if}
		{#if timer.isSupernova}
			<span class="supernova-badge">SUPERNOVA</span>
		{/if}
	</div>

	<div class="time-display">
		<span class="time">{timer.timeString}</span>
		<span class="separator">/</span>
		<span class="total">22:00</span>
	</div>

	<div class="progress-wrapper">
		<div class="progress-track">
			<div
				class="progress-unfilled"
				style="width: {(1 - timer.progress) * 100}%"
			></div>
		</div>
		<input
			type="range"
			min="0"
			max={LOOP_DURATION}
			value={timer.elapsed}
			oninput={onSeek}
			class="progress-input"
			aria-label="Seek timer"
		/>
	</div>

	<div class="time-markers">
		<span>0:00</span>
		<span>5:30</span>
		<span>11:00</span>
		<span>16:30</span>
		<span>22:00</span>
	</div>

	<div class="controls">
		{#if timer.isSupernova}
			<button class="btn btn-primary" onclick={() => timer.reset()}>↺ New Loop</button>
		{:else if timer.running}
			<button class="btn btn-secondary" onclick={() => timer.pause()}>⏸ Pause</button>
		{:else}
			<button class="btn btn-primary" onclick={() => timer.start()}>▶ Start</button>
		{/if}
		<button class="btn btn-ghost" onclick={() => timer.reset()}>↺ Reset</button>
	</div>
</div>

<style>
	.timer {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 1.5rem 2rem;
		transition: border-color 0.5s ease;
	}

	.timer.end-times {
		border-color: var(--accent);
		box-shadow: 0 0 24px rgba(245, 166, 35, 0.15);
	}

	.timer.supernova {
		border-color: var(--red);
		box-shadow: 0 0 40px rgba(255, 68, 68, 0.3);
		animation: supernova-pulse 1s ease-in-out infinite;
	}

	@keyframes supernova-pulse {
		0%, 100% { box-shadow: 0 0 40px rgba(255, 68, 68, 0.3); }
		50% { box-shadow: 0 0 60px rgba(255, 68, 68, 0.6); }
	}

	.timer-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.label {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.15em;
		color: var(--text-muted);
	}

	.warning-badge {
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--accent);
		background: rgba(245, 166, 35, 0.15);
		border: 1px solid rgba(245, 166, 35, 0.4);
		padding: 0.15em 0.6em;
		border-radius: 4px;
		animation: badge-blink 1s ease-in-out infinite;
	}

	.supernova-badge {
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--red);
		background: rgba(255, 68, 68, 0.15);
		border: 1px solid rgba(255, 68, 68, 0.4);
		padding: 0.15em 0.6em;
		border-radius: 4px;
	}

	@keyframes badge-blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}

	.time-display {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		margin-bottom: 1.25rem;
		font-family: var(--font-mono);
	}

	.time {
		font-size: 3.5rem;
		font-weight: 700;
		color: var(--text);
		line-height: 1;
		transition: color 0.5s ease;
	}

	.end-times .time {
		color: var(--accent);
	}

	.supernova .time {
		color: var(--red);
	}

	.separator {
		font-size: 1.5rem;
		color: var(--text-dim);
	}

	.total {
		font-size: 1.5rem;
		color: var(--text-muted);
	}

	.progress-wrapper {
		position: relative;
		height: 14px;
		margin-bottom: 0.4rem;
	}

	.progress-track {
		position: relative;
		height: 100%;
		border-radius: 7px;
		overflow: hidden;
		background: linear-gradient(
			to right,
			var(--cyan) 0%,
			var(--accent) 65%,
			#ff6b35 85%,
			var(--red) 100%
		);
	}

	.progress-unfilled {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		background: var(--surface-alt);
		transition: width 0.8s linear;
	}

	.progress-input {
		position: absolute;
		inset: -6px 0;
		width: 100%;
		height: calc(100% + 12px);
		opacity: 0;
		cursor: pointer;
		margin: 0;
	}

	.time-markers {
		display: flex;
		justify-content: space-between;
		font-size: 0.65rem;
		color: var(--text-dim);
		font-family: var(--font-mono);
		margin-bottom: 1.25rem;
	}

	.controls {
		display: flex;
		gap: 0.75rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 1.25rem;
		border-radius: var(--radius);
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.03em;
		cursor: pointer;
		border: 1px solid transparent;
		transition: all 0.15s ease;
		font-family: inherit;
	}

	.btn-primary {
		background: var(--accent);
		color: #0a0c14;
		border-color: var(--accent);
	}

	.btn-primary:hover {
		background: #fbb740;
	}

	.btn-secondary {
		background: transparent;
		color: var(--text);
		border-color: var(--border-light);
	}

	.btn-secondary:hover {
		border-color: var(--text-muted);
	}

	.btn-ghost {
		background: transparent;
		color: var(--text-muted);
		border-color: transparent;
	}

	.btn-ghost:hover {
		color: var(--text);
		border-color: var(--border);
	}
</style>
