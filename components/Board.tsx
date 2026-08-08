import { CSSProperties } from 'react';
import { GameTile, GRID_SIZE } from '@/lib/types';
import { Tile } from './Tile';

const GAP_PX = 12;

const boardStyle = {
  '--board-size': 'min(92vw, 440px)',
  '--cell-size': `calc((var(--board-size) - ${GAP_PX * (GRID_SIZE - 1)}px - ${
    GAP_PX * 2
  }px) / ${GRID_SIZE})`,
  width: 'var(--board-size)',
  height: 'var(--board-size)',
} as CSSProperties;

interface BoardProps {
  tiles: GameTile[];
}

export function Board({ tiles }: BoardProps) {
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE });

  return (
    <div className="relative touch-none rounded-2xl bg-slate-800 p-3" style={boardStyle}>
      <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-3">
        {cells.map((_, index) => (
          <div key={index} className="rounded-xl bg-slate-700/50" />
        ))}
      </div>
      <div className="absolute inset-3">
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  );
}
