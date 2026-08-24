interface ToastProps {
  message: string;
  tone?: 'violet' | 'amber';
}

export function Toast({ message, tone = 'violet' }: ToastProps) {
  const toneClass =
    tone === 'amber' ? 'bg-amber-400 text-slate-900' : 'bg-violet-600 text-white';

  return (
    <span
      className={`toast-badge pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold shadow-lg ${toneClass}`}
    >
      {message}
    </span>
  );
}
