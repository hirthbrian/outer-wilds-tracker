# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview production build
npm run check     # TypeScript + Svelte type-check (run after changes)
```

## Architecture

**SvelteKit** (Svelte 5, TypeScript). Single-page app — no server routes, no backend, all state is client-side.

### Data flow

```
src/lib/events.ts          → static event data + getEventStatus()
src/lib/timer.svelte.ts    → singleton Timer class ($state runes), imported by any component
src/routes/+page.svelte    → layout, holds selectedPlanet filter state
  ├── Timer.svelte         → reads timer singleton directly
  ├── PlanetFilter.svelte  → emits onselect, parent owns state
  └── EventCard.svelte     → receives (event, status, isLast) as props
```

The `timer` singleton in `timer.svelte.ts` is the single source of truth for elapsed time. Components import it directly — no prop drilling for timer state.

### Key constants

- `LOOP_DURATION = 1320` (22 minutes in seconds) — defined in `events.ts`, used everywhere
- Event status windows: ongoing events stay "active" until `endSeconds`; point events stay "active" for 30 seconds after `timeSeconds`

### Svelte 5 patterns used

- Runes (`$state`, `$derived`) in `.svelte.ts` files for shared reactive state
- `$props()` with inline type annotations in components
- No Svelte stores (`writable`, `readable`) — use rune-based classes instead

## Styling

All design tokens are CSS custom properties in `src/app.css`. Key variables:

```css
--bg, --surface, --surface-alt   /* backgrounds */
--border, --border-light          /* borders */
--accent                          /* #f5a623 amber — primary UI color */
--cyan                            /* #4fc3f7 — secondary, space feel */
--red                             /* #ff4444 — supernova/danger */
--text, --text-muted, --text-dim  /* text hierarchy */
--font-mono                       /* Courier New — used for timestamps */
```

Component styles are scoped (`<style>` in each `.svelte` file). No CSS framework.

## Adding events

Events live in `src/lib/events.ts` as a plain array. Each event:

```ts
{
  id: number,
  planet: string,          // must match an entry in the planets array
  timeSeconds: number,     // seconds from loop start (0–1320)
  endSeconds?: number,     // for ongoing events
  title: string,
  description: string,
  ongoing?: boolean        // true = stays active until endSeconds
}
```

Adding a new planet requires updating both the `events` array and the `planets` array, and adding a color entry to the `planetColors` records in `PlanetFilter.svelte` and `EventCard.svelte`.
