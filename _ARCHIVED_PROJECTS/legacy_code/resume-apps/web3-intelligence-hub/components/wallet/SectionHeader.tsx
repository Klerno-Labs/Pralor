type Props = {
    title: string
    subtitle?: string
}

export default function SectionHeader({ title, subtitle }: Props) {
    return (
        <header className="flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-tight text-slate-100">
                {title}
            </h2>
            {subtitle && (
                <p className="text-xs text-slate-400 max-w-md text-right">{subtitle}</p>
            )}
        </header>
    )
}
