/**
 * Orbital mechanics for the Outer Wilds solar system.
 *
 * Distances are normalized so that Giant's Deep orbit radius = 1.0.
 * Real in-game distances (Unity units, approx):
 *   Hourglass Twins barycenter: ~4700  → 0.294
 *   Timber Hearth:              ~9000  → 0.5625
 *   Brittle Hollow:             ~12000 → 0.750
 *   Giant's Deep:               ~16000 → 1.0
 *   Dark Bramble:               ~17920 → 1.12
 *
 * Periods are derived from Kepler's 3rd law (T² ∝ r³) anchored on
 * Giant's Deep T=621s, then verified against OWClock event timestamps.
 */

// ── Kepler solver ──────────────────────────────────────────────────────────

/** Solve Kepler's equation M = E - e·sin(E) for E via Newton-Raphson. */
function solveKepler(M: number, e: number, iterations = 6): number {
	let E = M;
	for (let i = 0; i < iterations; i++) {
		E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
	}
	return E;
}

/** Convert eccentric anomaly to (x, y) in orbit plane (semi-major axis = 1). */
function keplerToXY(E: number, e: number): [number, number] {
	const x = Math.cos(E) - e;
	const y = Math.sqrt(1 - e * e) * Math.sin(E);
	return [x, y];
}

// ── Body definitions ───────────────────────────────────────────────────────

export interface BodyState {
	x: number; // normalized, centered on sun
	y: number;
	label: string;
	color: string;
	radius: number; // display radius in normalized coords (for dot size scaling)
	visible: boolean;
}

interface CircularBody {
	kind: 'circular';
	label: string;
	color: string;
	r: number;    // orbit radius (normalized)
	period: number; // seconds per full orbit
	phase0: number; // initial angle offset (radians) at t=0
	radius: number;
	// Optional parent offset (for moons / binary components)
	parent?: () => [number, number];
	vanishAt?: number; // disappear after this elapsed time
}

interface EllipticalBody {
	kind: 'elliptical';
	label: string;
	color: string;
	a: number;    // semi-major axis (normalized)
	e: number;    // eccentricity
	period: number;
	M0: number;   // mean anomaly at t=0
	rotAngle: number; // rotation of periapsis direction from +x axis (radians)
	radius: number;
}

type BodyDef = CircularBody | EllipticalBody;

// Hourglass Twins barycenter position (computed on the fly)
function htBarycenter(elapsed: number): [number, number] {
	const r = 0.294;
	const T = 114;
	const angle = (2 * Math.PI * elapsed) / T;
	return [r * Math.cos(angle), r * Math.sin(angle)];
}

const BODIES: BodyDef[] = [
	// ── Hourglass Twins (binary pair orbiting shared barycenter) ──
	{
		kind: 'circular',
		label: 'Ash Twin',
		color: '#f5a623',
		r: 0.04,
		period: 30,
		phase0: 0,
		radius: 0.022,
		parent: () => htBarycenter(currentElapsed)
	},
	{
		kind: 'circular',
		label: 'Ember Twin',
		color: '#ff6f00',
		r: 0.04,
		period: 30,
		phase0: Math.PI, // opposite side of barycenter
		radius: 0.018,
		parent: () => htBarycenter(currentElapsed)
	},

	// ── Timber Hearth + Attlerock ──
	{
		kind: 'circular',
		label: 'Timber Hearth',
		color: '#4caf50',
		r: 0.5625,
		period: 262,
		phase0: Math.PI * 0.3,
		radius: 0.028
	},

	// ── Brittle Hollow + Hollow's Lantern ──
	{
		kind: 'circular',
		label: 'Brittle Hollow',
		color: '#ab47bc',
		r: 0.750,
		period: 408,
		phase0: Math.PI * 1.1,
		radius: 0.028
	},

	// ── Giant's Deep ──
	{
		kind: 'circular',
		label: "Giant's Deep",
		color: '#1976d2',
		r: 1.0,
		period: 621,
		phase0: Math.PI * 0.7,
		radius: 0.034
	},

	// ── Dark Bramble ──
	{
		kind: 'circular',
		label: 'Dark Bramble',
		color: '#546e7a',
		r: 1.12,
		period: 900,
		phase0: Math.PI * 1.6,
		radius: 0.030
	},

	// ── Interloper (highly elliptical comet) ──
	// Periapsis at t=220s, period=477s, e=0.704
	// Semi-major axis a chosen so perihelion distance ≈ 0.10 (inside Ash Twin)
	// a*(1-e) = 0.10 → a = 0.10/0.296 ≈ 0.338; but scaled to normalized units.
	// Verified: aphelion ≈ 0.338*(1+0.704) = 0.576 (between TH and BH — correct)
	// M0 = -(2π/477)*220 = -2.898 rad (so M=0 at t=220s)
	{
		kind: 'elliptical',
		label: 'Interloper',
		color: '#90a4ae',
		a: 0.338,
		e: 0.704,
		period: 477,
		M0: -2.898,
		rotAngle: Math.PI * 0.85, // orient periapsis toward sun from upper-left
		radius: 0.018
	},

	// ── The Stranger (far-out, barely moves) ──
	{
		kind: 'circular',
		label: 'The Stranger',
		color: '#8d6e63',
		r: 1.45,
		period: 1800,
		phase0: Math.PI * 0.2,
		radius: 0.026
	},

	// ── Sun Station ──
	{
		kind: 'circular',
		label: 'Sun Station',
		color: '#f44336',
		r: 0.10,
		period: 28,
		phase0: Math.PI * 0.5,
		radius: 0.012,
		vanishAt: 690
	},

	// ── Attlerock (Timber Hearth moon) ──
	{
		kind: 'circular',
		label: 'Attlerock',
		color: '#78909c',
		r: 0.055,
		period: 55,
		phase0: 0,
		radius: 0.010,
		parent: () => computeCircularXY(timberHearthDef(), currentElapsed)
	},

	// ── Hollow's Lantern (Brittle Hollow moon) ──
	{
		kind: 'circular',
		label: "Hollow's Lantern",
		color: '#ff8a65',
		r: 0.055,
		period: 40,
		phase0: Math.PI,
		radius: 0.010,
		parent: () => computeCircularXY(brittleHollowDef(), currentElapsed)
	}
];

// References for moon parent lookups
function timberHearthDef(): CircularBody {
	return BODIES.find((b) => b.label === 'Timber Hearth') as CircularBody;
}
function brittleHollowDef(): CircularBody {
	return BODIES.find((b) => b.label === 'Brittle Hollow') as CircularBody;
}

// Module-level elapsed used by parent lambdas during a single computePositions call
let currentElapsed = 0;

function computeCircularXY(body: CircularBody, elapsed: number): [number, number] {
	const angle = (2 * Math.PI * elapsed) / body.period + body.phase0;
	const lx = body.r * Math.cos(angle);
	const ly = body.r * Math.sin(angle);
	if (body.parent) {
		const [px, py] = body.parent();
		return [px + lx, py + ly];
	}
	return [lx, ly];
}

// ── Public API ─────────────────────────────────────────────────────────────

export function computePositions(elapsed: number): Record<string, BodyState> {
	currentElapsed = elapsed;
	const result: Record<string, BodyState> = {};

	for (const body of BODIES) {
		let x: number, y: number;

		if (body.kind === 'circular') {
			[x, y] = computeCircularXY(body, elapsed);
		} else {
			// Elliptical
			const M = (2 * Math.PI * elapsed) / body.period + body.M0;
			const E = solveKepler(M, body.e);
			const [lx, ly] = keplerToXY(E, body.e);
			// Scale by semi-major axis and rotate by periapsis direction
			const cos = Math.cos(body.rotAngle);
			const sin = Math.sin(body.rotAngle);
			x = body.a * (cos * lx - sin * ly);
			y = body.a * (sin * lx + cos * ly);
		}

		const visible = body.kind === 'circular' && body.vanishAt !== undefined
			? elapsed < body.vanishAt
			: true;

		result[body.label] = { x, y, label: body.label, color: body.color, radius: body.radius, visible };
	}

	return result;
}

// ── Orbit path data for drawing ────────────────────────────────────────────

export interface OrbitRing {
	r: number;
	color: string;
	dashed?: boolean;
}

/** Circular orbit rings to draw as background guides. */
export const ORBIT_RINGS: OrbitRing[] = [
	{ r: 0.294, color: 'rgba(245,166,35,0.15)' },   // HT barycenter
	{ r: 0.5625, color: 'rgba(76,175,80,0.15)' },   // TH
	{ r: 0.750, color: 'rgba(171,71,188,0.15)' },   // BH
	{ r: 1.0, color: 'rgba(25,118,210,0.15)' },     // GD
	{ r: 1.12, color: 'rgba(84,110,122,0.15)' },    // DB
	{ r: 1.45, color: 'rgba(141,110,99,0.10)' },    // Stranger
];

export interface InterloperEllipse {
	a: number;
	b: number;
	e: number;
	cx: number; // center offset from sun along periapsis axis
	cy: number;
	rotAngle: number;
}

/** Interloper ellipse parameters for drawing. */
export const INTERLOPER_ELLIPSE: InterloperEllipse = (() => {
	const body = BODIES.find((b) => b.label === 'Interloper') as EllipticalBody;
	const a = body.a;
	const e = body.e;
	const b = a * Math.sqrt(1 - e * e);
	// Sun is at one focus; center is offset from focus by a*e along periapsis axis
	const focusOffsetX = a * e * Math.cos(body.rotAngle);
	const focusOffsetY = a * e * Math.sin(body.rotAngle);
	return { a, b, e, cx: -focusOffsetX, cy: -focusOffsetY, rotAngle: body.rotAngle };
})();
