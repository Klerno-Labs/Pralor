interface TrendPillProps {
    value: number;
    className?: string;
}

export function TrendPill({ value, className = "" }: TrendPillProps) {
    const isPositive = value >= 0;
    const isNeutral = value === 0;

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${isPositive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : isNeutral
                        ? "bg-slate-500/10 text-slate-400"
                        : "bg-rose-500/10 text-rose-400"
                } ${className}`}
        >
            {isPositive ? "↑" : isNeutral ? "—" : "↓"}
            {Math.abs(value).toFixed(2)}%
        </span>
    );
}
