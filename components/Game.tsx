'use client';

import { useGame } from '@/hooks/useGame';
import { Board } from './Board';
import { GameOverlay } from './GameOverlay';
import { ScoreBoard } from './ScoreBoard';

export function Game() {
  const { tiles, score, bestScore, status, restart, continuePlaying } = useGame();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex w-full max-w-[440px] flex-col gap-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">2048</h1>
            <p className="mt-1 text-sm text-slate-400">
              Join the tiles, reach <span className="font-semibold text-violet-300">2048</span>.
            </p>
          </div>
          <ScoreBoard score={score} bestScore={bestScore} />
        </header>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-400">Arrow keys or swipe to move.</p>
          <button
            type="button"
            onClick={restart}
            className="shrink-0 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-violet-950 transition-colors hover:bg-violet-500 active:bg-violet-700"
          >
            New Game
          </button>
        </div>

        <div className="relative self-center">
          <Board tiles={tiles} />
          {status !== 'playing' && (
            <GameOverlay status={status} onKeepPlaying={continuePlaying} onRestart={restart} />
          )}
        </div>
      </div>
    </main>
  );
}
