import { SavedGameState } from './types';

const BEST_SCORE_KEY = '2048-best-score';
const GAME_STATE_KEY = '2048-game-state';

export function loadBestScore(): number {
  if (typeof window === 'undefined') return 0;
  const raw = window.localStorage.getItem(BEST_SCORE_KEY);
  const value = raw ? Number(raw) : 0;
  return Number.isFinite(value) ? value : 0;
}

export function saveBestScore(score: number): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(BEST_SCORE_KEY, String(score));
}

export function loadGameState(): SavedGameState | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(GAME_STATE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedGameState;
  } catch {
    return null;
  }
}

export function saveGameState(state: SavedGameState): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
}

export function clearGameState(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(GAME_STATE_KEY);
}
