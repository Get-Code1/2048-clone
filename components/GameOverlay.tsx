interface GameOverlayProps {
  status: 'won' | 'over';
  onKeepPlaying: () => void;
  onRestart: () => void;
  onReplay?: () => void;
}

export function GameOverlay({ status, onKeepPlaying, onRestart, onReplay }: GameOverlayProps) {
  const isWin = status === 'won';

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 rounded-2xl bg-slate-950/85 backdrop-blur-sm">
      <p className="text-2xl font-bold tracking-tight text-slate-50">
        {isWin ? 'You reached 2048!' : 'Game Over'}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {isWin && (
          <button
            type="button"
            onClick={onKeepPlaying}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-600"
          >
            Keep Playing
          </button>
        )}
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
        >
          {isWin ? 'New Game' : 'Try Again'}
        </button>
        {onReplay && (
          <button
            type="button"
            onClick={onReplay}
            className="rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/5"
          >
            Watch Replay
          </button>
        )}
      </div>
    </div>
  );
}
