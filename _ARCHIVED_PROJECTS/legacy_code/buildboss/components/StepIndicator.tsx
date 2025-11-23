type Props = {
  current: number;
  total: number;
};

export function StepIndicator({ current, total }: Props) {
  return (
    <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-8 rounded-full transition-all ${
              i <= current ? "bg-accent" : "bg-slate-700"
            }`}
          />
        ))}
      </div>
      <span>
        Step {current + 1} / {total}
      </span>
    </div>
  );
}
