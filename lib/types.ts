export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameStatus = 'playing' | 'won' | 'over';

export const GRID_SIZE = 4;
export const WIN_VALUE = 2048;

export interface GameTile {
  id: string;
  value: number;
  row: number;
  col: number;
  isNew: boolean;
  justMerged: boolean;
  /** Tile merged into another tile this move; kept briefly so it can slide
   * into place alongside its target before being removed post-animation. */
  removing?: boolean;
}

export interface MoveResult {
  tiles: GameTile[];
  scoreDelta: number;
  moved: boolean;
}

export interface SavedGameState {
  tiles: GameTile[];
  score: number;
  status: GameStatus;
  keepPlaying: boolean;
  /** Highest win-tile milestone (2048, 4096, 8192, ...) already celebrated,
   * so a reload doesn't re-trigger a toast for a milestone already on the
   * board. */
  highestMilestone: number;
}

/** A single point in a game's move history: the settled board + score
 * right after a move, used to scrub back through a finished game. */
export interface HistoryEntry {
  tiles: GameTile[];
  score: number;
}

/** A transient "+N" score indicator shown briefly after a scoring move. */
export interface ScorePopup {
  id: string;
  value: number;
}
