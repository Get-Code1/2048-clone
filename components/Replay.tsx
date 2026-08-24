'use client';

import { useEffect, useState } from 'react';
import { HistoryEntry } from '@/lib/types';
import { Board } from './Board';

const PLAYBACK_INTERVAL_MS = 450;

interface ReplayProps {
  history: HistoryEntry[];
  onClose: () => void;
}

export function Replay({ history, onClose }: ReplayProps) {
  const lastIndex = history.length - 1;
  const [index, setIndex] = useState(lastIndex);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    if (index >= lastIndex) {
      setIsPlaying(false);
      return;
    }
    const timeout = setTimeout(() => setIndex((i) => Math.min(i + 1, lastIndex)), PLAYBACK_INTERVAL_MS);
    return () => clearTimeout(timeout);
  }, [isPlaying, index, lastIndex]);

  const frame = history[index];

  const jumpTo = (next: number) => {
    setIsPlaying(false);
    setIndex(Math.max(0, Math.min(lastIndex, next)));
  };

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-slate-950/95 p-6 backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Replay &middot; move {index} / {lastIndex}
      </p>

      <Board tiles={frame.tiles} />

      <p className="text-lg font-bold tabular-nums text-slate-50">Score: {frame.score}</p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => jumpTo(index - 1)}
          disabled={index === 0}
          className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => {
            if (index === lastIndex) {
              setIndex(0);
              setIsPlaying(true);
            } else {
              setIsPlaying((p) => !p);
            }
          }}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
        >
          {isPlaying ? 'Pause' : index === lastIndex ? 'Replay' : 'Play'}
        </button>
        <button
          type="button"
          onClick={() => jumpTo(index + 1)}
          disabled={index === lastIndex}
          className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={lastIndex}
        value={index}
        onChange={(event) => jumpTo(Number(event.target.value))}
        className="w-full max-w-[440px] accent-violet-500"
      />

      <button
        type="button"
        onClick={onClose}
        className="mt-1 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/5"
      >
        Close Replay
      </button>
    </div>
  );
}
