'use client';

import { useGame } from '@/hooks/useGame';
import { Board } from './Board';
import { GameOverlay } from './GameOverlay';
import { ScoreBoard } from './ScoreBoard';

export function Game() {
  const { tiles, score, bestScore, status, restart, continuePlaying } = useGame();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="flex w-full max-w-[440px] items-start justify-between">
        <h1 className="text-3xl font-bold tracking-tight">2048</h1>
        <ScoreBoard score={score} bestScore={bestScore} />
      </div>
      <div className="relative">
        <Board tiles={tiles} />
        {status !== 'playing' && (
          <GameOverlay status={status} onKeepPlaying={continuePlaying} onRestart={restart} />
        )}
      </div>
      <button
        type="button"
        onClick={restart}
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
      >
        New Game
      </button>
      <p className="text-center text-sm text-slate-400">
        Use arrow keys or swipe to combine tiles. Reach 2048 to win.
      </p>
    </main>
  );
}
