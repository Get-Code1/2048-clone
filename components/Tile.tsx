import { CSSProperties } from 'react';
import { GameTile } from '@/lib/types';

const GAP_PX = 12;

const VALUE_STYLES: Record<number, string> = {
  2: 'bg-violet-950 text-violet-100',
  4: 'bg-violet-900 text-violet-50',
  8: 'bg-violet-800 text-white',
  16: 'bg-violet-700 text-white',
  32: 'bg-violet-600 text-white',
  64: 'bg-violet-500 text-white',
  128: 'bg-fuchsia-600 text-white',
  256: 'bg-fuchsia-500 text-white',
  512: 'bg-amber-500 text-slate-900',
  1024: 'bg-amber-400 text-slate-900',
  2048: 'bg-amber-300 text-slate-900',
};

const FALLBACK_STYLE = 'bg-amber-200 text-slate-900';

function valueStyle(value: number): string {
  return VALUE_STYLES[value] ?? FALLBACK_STYLE;
}

function fontSizeClass(value: number): string {
  if (value >= 1000) return 'text-lg sm:text-xl';
  if (value >= 100) return 'text-xl sm:text-2xl';
  return 'text-2xl sm:text-3xl';
}

interface TileProps {
  tile: GameTile;
}

export function Tile({ tile }: TileProps) {
  const slotStyle: CSSProperties = {
    width: 'var(--cell-size)',
    height: 'var(--cell-size)',
    transform: `translate(calc(${tile.col} * (var(--cell-size) + ${GAP_PX}px)), calc(${tile.row} * (var(--cell-size) + ${GAP_PX}px)))`,
  };

  const faceClassName = [
    'tile-face flex h-full w-full items-center justify-center rounded-xl font-bold shadow-md shadow-black/30',
    fontSizeClass(tile.value),
    valueStyle(tile.value),
    tile.isNew && 'tile-spawn',
    tile.justMerged && 'tile-merged',
    tile.removing && 'tile-removing',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="tile-slot absolute left-0 top-0" style={slotStyle}>
      <div className={faceClassName}>{tile.value}</div>
    </div>
  );
}
