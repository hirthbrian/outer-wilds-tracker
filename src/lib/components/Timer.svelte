<script lang="ts">
	import { timer } from '$lib/timer.svelte';
	import { LOOP_DURATION } from '$lib/events';

	function onSeek(e: Event) {
		const input = e.target as HTMLInputElement;
		timer.seek(Number(input.value));
	}
</script>

<footer class="timer-footer" class:end-times={timer.isEndTimes} class:supernova={timer.isSupernova}>
	<div class="timer-inner">

		<div class="timer-top">
			<div class="timer-left">
				<span class="label">LOOP TIMER</span>
				{#if timer.isEndTimes}
					<span class="state-badge warning">END TIMES</span>
				{/if}
				{#if timer.isSupernova}
					<span class="state-badge danger">SUPERNOVA</span>
				{/if}
			</div>

			<div class="time-display">
				<span class="time">{timer.timeString}</span>
				<span class="time-total">/ 22:00</span>
			</div>

			<div class="controls">
				{#if timer.isSupernova}
					<button class="btn btn-danger" onclick={() => timer.reset()}>↺ NEW LOOP</button>
				{:else if timer.running}
					<button class="btn btn-outline" onclick={() => timer.pause()}>⏸ PAUSE</button>
				{:else}
					<button class="btn btn-primary" onclick={() => timer.start()}>▶ START</button>
				{/if}
				<button class="btn btn-ghost" onclick={() => timer.reset()}>↺</button>
			</div>
		</div>

		<div class="progress-area">
			<div class="progress-wrapper">
				<div class="progress-track">
					<div class="progress-unfilled" style="width: {(1 - timer.progress) * 100}%"></div>
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
		</div>

	</div>
</footer>

<style>
	.timer-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: var(--surface);
		border-top: 2px solid var(--border);
		transition: border-color 0.4s ease, box-shadow 0.4s ease;
	}

	.timer-footer.end-times {
		border-top-color: var(--warning);
		box-shadow: 0 -4px 32px rgba(217, 119, 6, 0.18);
	}

	.timer-footer.supernova {
		border-top-color: var(--danger);
		box-shadow: 0 -4px 48px rgba(220, 38, 38, 0.35);
		animation: supernova-pulse 0.8s ease-in-out infinite;
	}

	@keyframes supernova-pulse {
		0%, 100% { box-shadow: 0 -4px 48px rgba(220, 38, 38, 0.35); }
		50%       { box-shadow: 0 -4px 72px rgba(220, 38, 38, 0.6); }
	}

	/* ── Inner ── */
	.timer-inner {
		padding: var(--space-3) var(--space-8) var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.timer-top {
		display: flex;
		align-items: center;
		gap: var(--space-6);
	}

	.timer-top .controls {
		margin-left: auto;
	}

	/* ── Left: label + badges ── */
	.timer-left {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-shrink: 0;
	}

	.label {
		font-family: var(--font-body);
		font-size: 0.55rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		color: var(--text-dim);
	}

	.state-badge {
		font-family: var(--font-body);
		font-size: 0.55rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		padding: 2px 6px;
		border-radius: var(--radius);
		white-space: nowrap;
	}

	.state-badge.warning {
		color: var(--warning);
		background: rgba(217, 119, 6, 0.12);
		border: 1px solid rgba(217, 119, 6, 0.4);
		animation: blink 1s ease-in-out infinite;
	}

	.state-badge.danger {
		color: var(--danger);
		background: rgba(220, 38, 38, 0.12);
		border: 1px solid rgba(220, 38, 38, 0.4);
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50%       { opacity: 0.3; }
	}

	/* ── Time ── */
	.time-display {
		display: flex;
		align-items: baseline;
		gap: var(--space-2);
		flex-shrink: 0;
	}

	.time {
		font-family: var(--font-mono);
		font-size: 2.25rem;
		font-weight: 700;
		color: var(--text);
		line-height: 1;
		letter-spacing: -0.04em;
		transition: color 0.4s ease;
	}

	.end-times .time  { color: var(--warning); }
	.supernova .time  { color: var(--danger); }

	.time-total {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--text-dim);
		letter-spacing: -0.02em;
	}

	/* ── Progress area ── */
	.progress-area {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.progress-wrapper {
		position: relative;
		height: 20px;
	}

	.progress-track {
		position: relative;
		height: 100%;
		border-radius: var(--radius);
		overflow: hidden;
		background: linear-gradient(
			to right,
			var(--primary) 0%,
			var(--warning) 65%,
			#e05c1a 83%,
			var(--danger) 100%
		);
	}

	.progress-unfilled {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		background: var(--surface-alt);
		transition: width 0.9s linear;
	}

	.progress-input {
		position: absolute;
		inset: -8px 0;
		width: 100%;
		height: calc(100% + 16px);
		opacity: 0;
		cursor: pointer;
		margin: 0;
	}

	.time-markers {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: 0.55rem;
		font-weight: 500;
		color: var(--text-dim);
		letter-spacing: 0.05em;
	}

	/* ── Controls ── */
	.controls {
		display: flex;
		gap: var(--space-2);
		flex-shrink: 0;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 36px;
		padding: 0 var(--space-4);
		border-radius: var(--radius);
		font-family: var(--font-body);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		cursor: pointer;
		border: 2px solid transparent;
		transition: all 0.15s ease;
		white-space: nowrap;
	}

	.btn-primary {
		background: var(--primary);
		color: #fff;
		border-color: var(--primary);
	}
	.btn-primary:hover { background: var(--primary-hover); border-color: var(--primary-hover); }

	.btn-danger {
		background: var(--danger);
		color: #fff;
		border-color: var(--danger);
	}
	.btn-danger:hover { background: #ef4444; border-color: #ef4444; }

	.btn-outline {
		background: transparent;
		color: var(--text);
		border-color: var(--border-light);
	}
	.btn-outline:hover { border-color: var(--text-muted); }

	.btn-ghost {
		background: transparent;
		color: var(--text-muted);
		border-color: var(--border);
		padding: 0 var(--space-3);
	}
	.btn-ghost:hover { color: var(--text); border-color: var(--border-light); }
</style>
