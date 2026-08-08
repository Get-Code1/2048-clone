'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  createInitialTiles,
  hasReached2048,
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
import { Direction, GameStatus, GameTile } from '@/lib/types';
import { useSwipe } from './useSwipe';

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

const SETTLE_DELAY_MS = 200;

export function useGame() {
  const [tiles, setTiles] = useState<GameTile[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [keepPlaying, setKeepPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Randomized/persisted state is seeded client-side only, after mount, to
  // avoid a server/client hydration mismatch.
  useEffect(() => {
    setBestScore(loadBestScore());
    const saved = loadGameState();
    if (saved && saved.tiles.length > 0) {
      setTiles(saved.tiles);
      setScore(saved.score);
      setKeepPlaying(saved.keepPlaying);
    } else {
      setTiles(createInitialTiles());
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

      setTiles(nextTiles);
      if (result.scoreDelta > 0) {
        setScore((prev) => prev + result.scoreDelta);
      }
    },
    [tiles, status]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[event.key];
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
    setScore(0);
    setKeepPlaying(false);
    setTiles(createInitialTiles());
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
    });
  }, [isLoaded, tiles, score, status, keepPlaying]);

  useEffect(() => {
    if (score <= bestScore) return;
    setBestScore(score);
    saveBestScore(score);
  }, [score, bestScore]);

  return { tiles, score, bestScore, status, applyMove, restart, continuePlaying };
}
