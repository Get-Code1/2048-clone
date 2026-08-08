'use client';

import { useGame } from '@/hooks/useGame';
import { Board } from './Board';
import { ScoreBoard } from './ScoreBoard';

export function Game() {
  const { tiles, score, bestScore, restart } = useGame();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="flex w-full max-w-[440px] items-start justify-between">
        <h1 className="text-3xl font-bold tracking-tight">2048</h1>
        <ScoreBoard score={score} bestScore={bestScore} />
      </div>
      <Board tiles={tiles} />
      <button
        type="button"
        onClick={restart}
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
      >
        New Game
      </button>
    </main>
  );
}
