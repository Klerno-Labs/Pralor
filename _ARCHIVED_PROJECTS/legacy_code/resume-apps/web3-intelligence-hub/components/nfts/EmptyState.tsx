export default function EmptyState() {
    return (
        <div className="mt-12 flex flex-1 flex-col items-center justify-center text-center text-sm text-slate-400">
            <p className="max-w-md">
                Paste a collection contract address above and hit Explore. We will stream live data from Alchemy,
                render stats, and let you slice instantly by traits.
            </p>
            <p className="mt-3 text-xs text-slate-500">
                Example: <code className="rounded bg-white/5 px-2 py-1">0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d</code>
            </p>
        </div>
    )
}
