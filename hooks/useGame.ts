'use client';

import { useCallback, useEffect, useState } from 'react';
import { createInitialTiles, move, settleTiles, spawnRandomTile } from '@/lib/engine';
import { Direction, GameTile } from '@/lib/types';

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

export function useGame() {
  const [tiles, setTiles] = useState<GameTile[]>([]);

  // Board is randomized, so it's seeded client-side only, after mount, to
  // avoid a server/client hydration mismatch.
  useEffect(() => {
    setTiles(createInitialTiles());
  }, []);

  const applyMove = useCallback((direction: Direction) => {
    setTiles((current) => {
      const result = move(current, direction);
      if (!result.moved) return current;

      const spawned = spawnRandomTile(result.tiles);
      return spawned ? [...result.tiles, spawned] : result.tiles;
    });
  }, []);

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

  const restart = useCallback(() => {
    setTiles(createInitialTiles());
  }, []);

  useEffect(() => {
    if (!tiles.some((t) => t.removing)) return;
    const timeout = setTimeout(() => {
      setTiles((current) => settleTiles(current));
    }, 160);
    return () => clearTimeout(timeout);
  }, [tiles]);

  return { tiles, applyMove, restart };
}
