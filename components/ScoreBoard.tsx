import { ReactNode } from 'react';
import { ScorePopup } from '@/lib/types';
import { Toast } from './Toast';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  scorePopups: ScorePopup[];
  showNewBest: boolean;
}

function ScoreTile({
  label,
  value,
  children,
}: {
  label: string;
  value: number;
  children?: ReactNode;
}) {
  return (
    <div className="relative flex min-w-[76px] flex-col items-center rounded-xl border border-white/5 bg-slate-800 px-4 py-2 shadow-sm shadow-black/30">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="text-xl font-bold tabular-nums text-slate-50">{value}</span>
      {children}
    </div>
  );
}

export function ScoreBoard({ score, bestScore, scorePopups, showNewBest }: ScoreBoardProps) {
  return (
    <div className="flex gap-3">
      <ScoreTile label="Score" value={score}>
        {scorePopups.map((popup) => (
          <span
            key={popup.id}
            className="score-popup pointer-events-none absolute left-1/2 -top-4 text-sm font-bold text-violet-300"
          >
            +{popup.value}
          </span>
        ))}
      </ScoreTile>
      <ScoreTile label="Best" value={bestScore}>
        {showNewBest && <Toast message="New Best!" tone="amber" />}
      </ScoreTile>
    </div>
  );
}
