interface ScoreBoardProps {
  score: number;
  bestScore: number;
}

function ScoreTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex min-w-[76px] flex-col items-center rounded-xl bg-slate-800 px-4 py-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="text-xl font-bold tabular-nums text-slate-50">{value}</span>
    </div>
  );
}

export function ScoreBoard({ score, bestScore }: ScoreBoardProps) {
  return (
    <div className="flex gap-3">
      <ScoreTile label="Score" value={score} />
      <ScoreTile label="Best" value={bestScore} />
    </div>
  );
}
