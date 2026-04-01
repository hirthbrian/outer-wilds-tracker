<script lang="ts">
	import { timer } from '$lib/timer.svelte';
	import { LOOP_DURATION } from '$lib/events';
	import { computePositions, ORBIT_RINGS, INTERLOPER_ELLIPSE } from '$lib/orbits';
	import { planetIcons } from '$lib/planetIcons';

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;
	let animId: number;

	// Smooth interpolation: track when timer.elapsed last changed
	let lastElapsed = $state(0);
	let lastWallTime = 0;

	$effect(() => {
		lastElapsed = timer.elapsed;
		lastWallTime = performance.now();
	});

	function getSmoothedElapsed(): number {
		if (!timer.running) return timer.elapsed;
		const delta = (performance.now() - lastWallTime) / 1000;
		return Math.min(lastElapsed + delta, LOOP_DURATION);
	}

	// ── Preload planet SVG images ──────────────────────────────────────────

	const planetImages: Record<string, HTMLImageElement> = {};

	$effect(() => {
		for (const [name, url] of Object.entries(planetIcons)) {
			const img = new Image();
			img.src = url;
			// 'All' maps to the sun icon — store under 'Sun' key for the center body
			planetImages[name === 'All' ? '__sun__' : name] = img;
		}
	});

	// ── Canvas setup ──────────────────────────────────────────────────────

	$effect(() => {
		const observer = new ResizeObserver(onResize);
		observer.observe(container);
		onResize();
		animId = requestAnimationFrame(draw);

		return () => {
			observer.disconnect();
			cancelAnimationFrame(animId);
		};
	});

	function onResize() {
		if (!canvas || !container) return;
		const dpr = window.devicePixelRatio || 1;
		const rect = container.getBoundingClientRect();
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;
		canvas.style.width = rect.width + 'px';
		canvas.style.height = rect.height + 'px';
	}

	// ── Drawing ───────────────────────────────────────────────────────────

	function draw() {
		animId = requestAnimationFrame(draw);
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const W = canvas.width;
		const H = canvas.height;
		const dpr = window.devicePixelRatio || 1;
		const elapsed = getSmoothedElapsed();

		ctx.clearRect(0, 0, W, H);

		// Scale: map normalized 1.0 → roughly 35% of half the smaller dimension
		const viewR = Math.min(W, H) / 2;
		const scale = viewR * 0.62; // 1.0 normalized = 62% of half-canvas

		// Center
		const cx = W / 2;
		const cy = H / 2;

		// Helper: normalized → canvas px
		const px = (nx: number) => cx + nx * scale;
		const py = (ny: number) => cy + ny * scale;

		// ── Draw orbit rings ──────────────────────────────────────────────
		ctx.save();
		for (const ring of ORBIT_RINGS) {
			ctx.beginPath();
			ctx.arc(cx, cy, ring.r * scale, 0, Math.PI * 2);
			ctx.strokeStyle = ring.color;
			ctx.lineWidth = dpr;
			ctx.stroke();
		}
		ctx.restore();

		// ── Draw Interloper ellipse (dashed) ──────────────────────────────
		ctx.save();
		ctx.translate(cx, cy);
		ctx.rotate(INTERLOPER_ELLIPSE.rotAngle);
		ctx.translate(INTERLOPER_ELLIPSE.cx * scale, INTERLOPER_ELLIPSE.cy * scale);
		ctx.beginPath();
		ctx.ellipse(0, 0, INTERLOPER_ELLIPSE.a * scale, INTERLOPER_ELLIPSE.b * scale, 0, 0, Math.PI * 2);
		ctx.setLineDash([4 * dpr, 6 * dpr]);
		ctx.strokeStyle = 'rgba(144,164,174,0.25)';
		ctx.lineWidth = dpr;
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.restore();

		// ── Compute supernova progress for sun visuals ────────────────────
		const endTimesStart = 1200;
		const supernovaAt = LOOP_DURATION;
		const supernovaProgress = elapsed >= endTimesStart
			? (elapsed - endTimesStart) / (supernovaAt - endTimesStart)
			: 0;

		// ── Draw sun ──────────────────────────────────────────────────────
		{
			// Color transitions: gold → orange → red → white flash
			let sunColor: string;
			if (supernovaProgress >= 1) {
				sunColor = '#ffffff';
			} else if (supernovaProgress > 0.7) {
				const t = (supernovaProgress - 0.7) / 0.3;
				sunColor = lerpColor('#ff2200', '#ffffff', t);
			} else if (supernovaProgress > 0) {
				const t = supernovaProgress / 0.7;
				sunColor = lerpColor('#ffaa00', '#ff2200', t);
			} else {
				sunColor = '#ffcc44';
			}

			const sunR = (0.06 + supernovaProgress * 0.18) * scale;
			const glowR = (0.10 + supernovaProgress * 0.60) * scale;

			// Glow
			const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
			grd.addColorStop(0, sunColor + 'cc');
			grd.addColorStop(0.35, sunColor + '44');
			grd.addColorStop(1, 'transparent');
			ctx.beginPath();
			ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
			ctx.fillStyle = grd;
			ctx.fill();

			// Core or SVG
			const sunImg = planetImages['__sun__'];
			if (sunImg?.complete && sunImg.naturalWidth > 0 && supernovaProgress === 0) {
				const size = sunR * 3.5;
				ctx.drawImage(sunImg, cx - size / 2, cy - size / 2, size, size);
			} else {
				ctx.beginPath();
				ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
				ctx.fillStyle = sunColor;
				ctx.fill();
			}
		}

		// ── Draw planets ──────────────────────────────────────────────────
		const positions = computePositions(elapsed);

		// Skip labels for small/minor bodies
		const labelSkip = new Set(["Attlerock", "Hollow's Lantern", "Sun Station"]);

		for (const state of Object.values(positions)) {
			if (!state.visible) continue;

			const bx = px(state.x);
			const by = py(state.y);
			const br = Math.max(3 * dpr, state.radius * scale);
			const img = planetImages[state.label];

			// Glow behind the icon
			const glowSize = br * 2.2;
			const grd = ctx.createRadialGradient(bx, by, 0, bx, by, glowSize);
			grd.addColorStop(0, state.color + '55');
			grd.addColorStop(1, 'transparent');
			ctx.beginPath();
			ctx.arc(bx, by, glowSize, 0, Math.PI * 2);
			ctx.fillStyle = grd;
			ctx.fill();

			if (img?.complete && img.naturalWidth > 0) {
				// Draw SVG icon centered on position
				const size = br * 2;
				ctx.drawImage(img, bx - size / 2, by - size / 2, size, size);
			} else {
				// Fallback: colored dot
				ctx.beginPath();
				ctx.arc(bx, by, br, 0, Math.PI * 2);
				ctx.fillStyle = state.color;
				ctx.fill();
			}

			// Label
			if (!labelSkip.has(state.label)) {
				ctx.save();
				ctx.font = `${Math.round(13 * dpr)}px "JetBrains Mono", monospace`;
				ctx.textAlign = 'left';
				ctx.fillStyle = state.color + 'cc';
				ctx.fillText(state.label, bx + br + 4 * dpr, by + 3 * dpr);
				ctx.restore();
			}
		}

		// ── Draw elapsed time overlay ─────────────────────────────────────
		ctx.save();
		ctx.font = `bold ${Math.round(14 * dpr)}px "JetBrains Mono", monospace`;
		ctx.fillStyle = 'rgba(255,255,255,0.18)';
		ctx.textAlign = 'right';
		const mins = Math.floor(elapsed / 60);
		const secs = Math.floor(elapsed % 60);
		const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
		ctx.fillText(timeStr, W - 10 * dpr, H - 10 * dpr);
		ctx.restore();
	}

	// ── Color lerp utility ────────────────────────────────────────────────

	function lerpColor(a: string, b: string, t: number): string {
		const ra = parseInt(a.slice(1, 3), 16);
		const ga = parseInt(a.slice(3, 5), 16);
		const ba = parseInt(a.slice(5, 7), 16);
		const rb = parseInt(b.slice(1, 3), 16);
		const gb = parseInt(b.slice(3, 5), 16);
		const bb = parseInt(b.slice(5, 7), 16);
		const r = Math.round(ra + (rb - ra) * t);
		const g = Math.round(ga + (gb - ga) * t);
		const bv = Math.round(ba + (bb - ba) * t);
		return `rgb(${r},${g},${bv})`;
	}
</script>

<div class="solar-system" bind:this={container}>
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.solar-system {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		background: var(--bg);
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
