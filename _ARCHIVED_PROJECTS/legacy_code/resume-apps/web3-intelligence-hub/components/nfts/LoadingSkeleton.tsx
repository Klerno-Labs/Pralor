
export function StatSkeleton() {
    return (
        <div className="mt-8 w-full max-w-6xl rounded-3xl border border-border-subtle bg-card-dark/60 p-6 shadow-soft">
            <div className="flex animate-pulse flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                    <div className="h-3 w-24 rounded bg-white/10" />
                    <div className="h-7 w-64 rounded bg-white/10" />
                    <div className="h-4 w-40 rounded bg-white/10" />
                </div>
                <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="space-y-2 rounded-2xl bg-white/5 p-3">
                            <div className="h-3 w-16 rounded bg-white/10" />
                            <div className="h-5 w-20 rounded bg-white/10" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function GridSkeleton() {
    return (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="animate-pulse rounded-3xl border border-border-subtle bg-card-dark/60 p-3"
                >
                    <div className="mb-3 h-48 rounded-2xl bg-white/10" />
                    <div className="space-y-2">
                        <div className="h-4 w-3/4 rounded bg-white/10" />
                        <div className="h-3 w-1/2 rounded bg-white/10" />
                        <div className="h-3 w-1/3 rounded bg-white/10" />
                    </div>
                </div>
            ))}
        </div>
    )
}
