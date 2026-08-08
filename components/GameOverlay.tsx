interface GameOverlayProps {
  status: 'won' | 'over';
  onKeepPlaying: () => void;
  onRestart: () => void;
}

export function GameOverlay({ status, onKeepPlaying, onRestart }: GameOverlayProps) {
  const isWin = status === 'won';

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 rounded-2xl bg-slate-950/85 backdrop-blur-sm">
      <p className="text-2xl font-bold tracking-tight text-slate-50">
        {isWin ? 'You reached 2048!' : 'Game Over'}
      </p>
      <div className="flex gap-3">
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
      </div>
    </div>
  );
}
