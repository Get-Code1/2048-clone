import { Direction, GameTile, GRID_SIZE, MoveResult } from './types';

export function createTileId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `tile-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

function buildGrid(tiles: GameTile[]): (GameTile | null)[][] {
  const grid: (GameTile | null)[][] = Array.from({ length: GRID_SIZE }, () =>
    Array<GameTile | null>(GRID_SIZE).fill(null)
  );
  for (const tile of tiles) {
    grid[tile.row][tile.col] = tile;
  }
  return grid;
}

/** Coordinates for each row/column, ordered from the edge tiles slide
 * toward, outward to the far edge. */
function getLines(direction: Direction): [number, number][][] {
  const lines: [number, number][][] = [];
  if (direction === 'left' || direction === 'right') {
    const cols = direction === 'left' ? [0, 1, 2, 3] : [3, 2, 1, 0];
    for (let r = 0; r < GRID_SIZE; r++) {
      lines.push(cols.map((c): [number, number] => [r, c]));
    }
  } else {
    const rows = direction === 'up' ? [0, 1, 2, 3] : [3, 2, 1, 0];
    for (let c = 0; c < GRID_SIZE; c++) {
      lines.push(rows.map((r): [number, number] => [r, c]));
    }
  }
  return lines;
}

export function move(tiles: GameTile[], direction: Direction): MoveResult {
  const activeTiles = tiles.filter((t) => !t.removing);
  const grid = buildGrid(activeTiles);
  const lines = getLines(direction);

  let scoreDelta = 0;
  let moved = false;
  const resultTiles: GameTile[] = [];

  for (const line of lines) {
    const originalTiles = line
      .map(([r, c]) => grid[r][c])
      .filter((t): t is GameTile => t !== null);

    const settled: GameTile[] = [];

    for (const tile of originalTiles) {
      const last = settled[settled.length - 1];
      if (last && last.value === tile.value && !last.justMerged) {
        const [targetRow, targetCol] = line[settled.length - 1];
        settled[settled.length - 1] = {
          ...last,
          value: last.value * 2,
          justMerged: true,
          isNew: false,
        };
        resultTiles.push({
          ...tile,
          row: targetRow,
          col: targetCol,
          isNew: false,
          justMerged: false,
          removing: true,
        });
        scoreDelta += last.value * 2;
        moved = true;
      } else {
        settled.push({ ...tile, isNew: false, justMerged: false });
      }
    }

    settled.forEach((tile, index) => {
      const [row, col] = line[index];
      if (tile.row !== row || tile.col !== col) moved = true;
      resultTiles.push({ ...tile, row, col });
    });
  }

  return { tiles: resultTiles, scoreDelta, moved };
}

export function spawnRandomTile(tiles: GameTile[]): GameTile | null {
  const occupied = new Set(tiles.filter((t) => !t.removing).map((t) => `${t.row},${t.col}`));
  const empty: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!occupied.has(`${r},${c}`)) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return null;

  const [row, col] = empty[Math.floor(Math.random() * empty.length)];
  return {
    id: createTileId(),
    value: Math.random() < 0.9 ? 2 : 4,
    row,
    col,
    isNew: true,
    justMerged: false,
  };
}

export function createInitialTiles(): GameTile[] {
  let tiles: GameTile[] = [];
  const first = spawnRandomTile(tiles);
  if (first) tiles = [...tiles, first];
  const second = spawnRandomTile(tiles);
  if (second) tiles = [...tiles, second];
  return tiles;
}

/** Drop tiles that finished merging away, and clear one-shot animation
 * flags, once their transition has had time to play. */
export function settleTiles(tiles: GameTile[]): GameTile[] {
  return tiles
    .filter((t) => !t.removing)
    .map((t) => ({ ...t, isNew: false, justMerged: false }));
}

export function hasReached2048(tiles: GameTile[]): boolean {
  return tiles.some((t) => !t.removing && t.value >= 2048);
}

export function isGameOver(tiles: GameTile[]): boolean {
  const activeTiles = tiles.filter((t) => !t.removing);
  if (activeTiles.length < GRID_SIZE * GRID_SIZE) return false;

  const grid = buildGrid(activeTiles);
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const value = grid[r][c]?.value;
      if (value === undefined) return false;
      const right = grid[r][c + 1]?.value;
      const down = grid[r + 1]?.[c]?.value;
      if (right === value || down === value) return false;
    }
  }
  return true;
}
