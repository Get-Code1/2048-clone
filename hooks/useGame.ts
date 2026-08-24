'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  createInitialTiles,
  createTileId,
  hasReached2048,
  highestTileValue,
  isGameOver,
  move,
  settleTiles,
  spawnRandomTile,
} from '@/lib/engine';
import {
  clearGameState,
  loadBestScore,
  loadGameState,
  saveBestScore,
  saveGameState,
} from '@/lib/storage';
import { Direction, GameStatus, GameTile, HistoryEntry, ScorePopup, WIN_VALUE } from '@/lib/types';
import { useSwipe } from './useSwipe';

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  // WASD
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
  // vim-style hjkl
  k: 'up',
  j: 'down',
  h: 'left',
  l: 'right',
};

const SETTLE_DELAY_MS = 200;
const SCORE_POPUP_DURATION_MS = 700;
const NEW_BEST_TOAST_DURATION_MS = 1800;
const MILESTONE_TOAST_DURATION_MS = 2200;
const MAX_HISTORY = 1000;

export function useGame() {
  const [tiles, setTiles] = useState<GameTile[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [keepPlaying, setKeepPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [showNewBest, setShowNewBest] = useState(false);
  const [highestMilestone, setHighestMilestone] = useState(WIN_VALUE);
  const [milestoneToast, setMilestoneToast] = useState<string | null>(null);

  // Randomized/persisted state is seeded client-side only, after mount, to
  // avoid a server/client hydration mismatch.
  useEffect(() => {
    setBestScore(loadBestScore());
    const saved = loadGameState();
    if (saved && saved.tiles.length > 0) {
      setTiles(saved.tiles);
      setScore(saved.score);
      setKeepPlaying(saved.keepPlaying);
      setHighestMilestone(saved.highestMilestone ?? WIN_VALUE);
      setHistory([{ tiles: settleTiles(saved.tiles), score: saved.score }]);
    } else {
      const initial = createInitialTiles();
      setTiles(initial);
      setHistory([{ tiles: settleTiles(initial), score: 0 }]);
    }
    setIsLoaded(true);
  }, []);

  const hasWon = hasReached2048(tiles);
  const isOver = isGameOver(tiles);
  const status: GameStatus = isOver ? 'over' : hasWon && !keepPlaying ? 'won' : 'playing';

  const applyMove = useCallback(
    (direction: Direction) => {
      if (status !== 'playing') return;

      const result = move(tiles, direction);
      if (!result.moved) return;

      const spawned = spawnRandomTile(result.tiles);
      const nextTiles = spawned ? [...result.tiles, spawned] : result.tiles;
      const nextScore = score + result.scoreDelta;

      setTiles(nextTiles);

      if (result.scoreDelta > 0) {
        setScore(nextScore);

        const popupId = createTileId();
        setScorePopups((prev) => [...prev, { id: popupId, value: result.scoreDelta }]);
        setTimeout(() => {
          setScorePopups((prev) => prev.filter((p) => p.id !== popupId));
        }, SCORE_POPUP_DURATION_MS);
      }

      setHistory((prev) => {
        const updated = [...prev, { tiles: settleTiles(nextTiles), score: nextScore }];
        return updated.length > MAX_HISTORY ? updated.slice(updated.length - MAX_HISTORY) : updated;
      });

      const newMax = highestTileValue(nextTiles);
      if (newMax > highestMilestone) {
        setHighestMilestone(newMax);
        setMilestoneToast(`${newMax} tile!`);
        setTimeout(() => setMilestoneToast(null), MILESTONE_TOAST_DURATION_MS);
      }
    },
    [tiles, status, score, highestMilestone]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const direction = KEY_TO_DIRECTION[key];
      if (!direction) return;
      event.preventDefault();
      applyMove(direction);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [applyMove]);

  useSwipe(applyMove);

  const restart = useCallback(() => {
    clearGameState();
    const initial = createInitialTiles();
    setScore(0);
    setKeepPlaying(false);
    setHighestMilestone(WIN_VALUE);
    setScorePopups([]);
    setShowNewBest(false);
    setMilestoneToast(null);
    setTiles(initial);
    setHistory([{ tiles: settleTiles(initial), score: 0 }]);
  }, []);

  const continuePlaying = useCallback(() => {
    setKeepPlaying(true);
  }, []);

  // Drop merged-away ghost tiles and one-shot animation flags once their
  // transition/animation has had time to play.
  useEffect(() => {
    if (!tiles.some((t) => t.removing)) return;
    const timeout = setTimeout(() => {
      setTiles((current) => settleTiles(current));
    }, SETTLE_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [tiles]);

  useEffect(() => {
    if (!isLoaded) return;
    saveGameState({
      tiles: tiles.filter((t) => !t.removing),
      score,
      status,
      keepPlaying,
      highestMilestone,
    });
  }, [isLoaded, tiles, score, status, keepPlaying, highestMilestone]);

  useEffect(() => {
    if (score <= bestScore) return;
    setBestScore(score);
    saveBestScore(score);
    setShowNewBest(true);
  }, [score, bestScore]);

  useEffect(() => {
    if (!showNewBest) return;
    const timeout = setTimeout(() => setShowNewBest(false), NEW_BEST_TOAST_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [showNewBest]);

  return {
    tiles,
    score,
    bestScore,
    status,
    history,
    scorePopups,
    showNewBest,
    milestoneToast,
    applyMove,
    restart,
    continuePlaying,
  };
}
