import { CSSProperties } from 'react';
import { GameTile } from '@/lib/types';

const GAP_PX = 12;

interface TileProps {
  tile: GameTile;
}

export function Tile({ tile }: TileProps) {
  const style: CSSProperties = {
    width: 'var(--cell-size)',
    height: 'var(--cell-size)',
    transform: `translate(calc(${tile.col} * (var(--cell-size) + ${GAP_PX}px)), calc(${tile.row} * (var(--cell-size) + ${GAP_PX}px)))`,
  };

  return (
    <div
      className="absolute left-0 top-0 flex items-center justify-center rounded-xl bg-violet-600 text-2xl font-bold text-white"
      style={style}
    >
      {tile.value}
    </div>
  );
}
