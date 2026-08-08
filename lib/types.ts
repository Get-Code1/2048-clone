export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameStatus = 'playing' | 'won' | 'over';

export const GRID_SIZE = 4;

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
}
