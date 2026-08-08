# 2048 Clone

A from-scratch 2048 built as a static Next.js app. No backend, no game
libraries — the grid, move/merge logic, and animations are all hand-rolled.

## Stack

- **Next.js (App Router) + TypeScript + Tailwind CSS**
- `output: 'export'` in `next.config.mjs` — this is a fully static site,
  built to `out/` and deployable to any static host. No API routes, no
  server components that need a runtime.
- `localStorage` for best score and in-progress game state (see
  `lib/storage.ts`). No other persistence.
- No external game/animation libraries. Animations are plain CSS
  (`transition` for sliding, `@keyframes` for spawn/merge) driven by React
  state changes.

## Commands

```
npm run dev        # dev server
npm run build       # production build + static export to out/
npm run lint         # eslint
npm run typecheck     # tsc --noEmit
```

## Architecture

**Engine (`lib/engine.ts`)** is pure and framework-agnostic: `move(tiles,
direction)` takes the current flat tile array and returns the next one, plus
score delta and whether anything actually moved. `spawnRandomTile`,
`isGameOver`, and `hasReached2048` round out the game rules. None of this
code touches React, the DOM, or localStorage — it's unit-testable in
isolation and is the place to look for anything about how moves/merges/win
are decided.

Tiles are a **flat array of `GameTile`** (`lib/types.ts`), not a 2D grid of
values, and each tile carries a stable `id`. That stability is what makes
animation possible: React reconciles a tile to the same DOM node across
moves (keyed by `id`), so changing its row/col just changes a CSS
`transform` on an existing element, which transitions smoothly. A grid of
plain values would force full re-renders with no continuity to animate.

**Merge handling**: when two tiles combine, the "winner" keeps its own id
and gets `justMerged: true` (drives the bounce keyframe) and the "loser" is
kept in the returned array with `removing: true` and its position set to
the same target cell as the winner — so it visually slides in and fades
out on top of/behind the winner, rather than just vanishing. `hooks/useGame.ts`
removes `removing` tiles and clears the one-shot `isNew`/`justMerged` flags
via `settleTiles()` after a timeout matched to the CSS animation duration.

**Animation layering (`components/Tile.tsx`)**: each tile is two nested
elements — an outer "slot" div that only ever has `transform: translate(...)`
with a CSS `transition` (the slide), and an inner "face" div that runs the
spawn pop-in / merge bounce `@keyframes` (which animate `scale`). This split
exists because CSS keyframe animations override inline styles for the
properties they animate — if slide and scale/bounce were both `transform`
on the same element, the keyframe would clobber the position during the
animation. Don't collapse them back into one element without re-solving
that conflict.

**Board sizing (`components/Board.tsx`, `components/Tile.tsx`)**: the board
size is a CSS custom property (`--board-size: min(92vw, 440px)`), and cell
size is derived from it via `calc()`, all in absolute units (`vw`/`px`,
never `%`). This matters because `%` inside a CSS `transform` resolves
against the *transformed element's own box*, not its parent — so a
percentage-based cell size would break tile positioning. Keep board/cell
sizing in `vw`/`px` if you touch this.

**SSR/hydration**: initial tile state, best score, and saved game state are
all randomized/`localStorage`-backed, so they're seeded in a `useEffect`
after mount in `hooks/useGame.ts`, not in `useState(() => ...)`. Seeding
them during the initial render diverges between server and client and
produces a React hydration mismatch (this was a real bug during
development — see git history if you want the failure mode).

**Persistence (`lib/storage.ts`)**: best score and the current board/score/
win-state are saved to `localStorage` on every change, guarded with
`typeof window !== 'undefined'` checks so the module is safe to import from
code that might run during the static export build.

**Controls**: keyboard (arrow keys) and touch swipe both live in
`hooks/useGame.ts` / `hooks/useSwipe.ts`, both funneling into the same
`applyMove(direction)`. Swipe direction is a simple `touchstart`/`touchend`
delta threshold (30px), no gesture library.

## File structure

```
app/
  layout.tsx        # root layout, metadata, background
  page.tsx           # renders <Game />
  globals.css         # Tailwind layers + tile animation keyframes
  icon.svg             # favicon (Next's file-based icon convention)
components/
  Game.tsx            # composition root: header, score, board, overlay
  Board.tsx            # background grid cells + board sizing CSS vars
  Tile.tsx              # single tile: position transform + spawn/merge animation
  ScoreBoard.tsx          # score / best score display
  GameOverlay.tsx          # win ("Keep Playing"/"New Game") and game-over overlay
lib/
  types.ts             # GameTile, Direction, GameStatus, SavedGameState
  engine.ts              # pure move/merge/spawn/win/game-over logic
  storage.ts               # localStorage read/write, SSR-safe
hooks/
  useGame.ts             # owns board/score/status state, keyboard input, persistence
  useSwipe.ts               # touch swipe -> Direction
```

## Conventions

- Keep game rules in `lib/engine.ts` as pure functions — no DOM/React/
  localStorage there. If you need new game logic, it belongs here first,
  wired into `useGame` after.
- Grid size is fixed at 4x4 (`GRID_SIZE` in `lib/types.ts`); this was a
  deliberate scope decision, not an oversight — the engine isn't written
  to generalize to other sizes without changes to `isGameOver`'s adjacency
  checks and the board sizing CSS.
- No undo — matches the classic 2048's behavior; this was an explicit
  decision, not a missing feature.
- Theme is slate/violet, dark-mode-first, intentionally distinct from the
  original's beige/orange. Tile value → color mapping lives in
  `components/Tile.tsx` (`VALUE_STYLES`).
