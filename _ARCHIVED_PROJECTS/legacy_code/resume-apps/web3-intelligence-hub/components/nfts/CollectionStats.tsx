import { useEffect, useState } from 'react'
import type { CollectionMetadata } from '@/types/nft'

type Props = {
    metadata: CollectionMetadata | null
}

const formatValue = (value: number | null, suffix?: string) => {
    if (value == null || Number.isNaN(value)) return 'N/A'
    const formatted = value >= 1_000 ? value.toLocaleString() : value
    return suffix ? `${formatted} ${suffix}` : formatted
}

export default function CollectionStats({ metadata }: Props) {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!copied) return
        const timeout = setTimeout(() => setCopied(false), 1400)
        return () => clearTimeout(timeout)
    }, [copied])

    if (!metadata) return null

    const { name, address, totalSupply, floorPrice, owners, network, symbol } = metadata

    const copyAddress = async () => {
        try {
            await navigator.clipboard.writeText(address)
            setCopied(true)
        } catch {
            setCopied(false)
        }
    }

    return (
        <section className="glass-card mt-8 w-full max-w-6xl rounded-3xl p-8 shadow-glow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-accent-2/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                    <div className="flex items-center gap-3">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Live Feed</p>
                    </div>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-white">{name}</h2>
                    <p className="mt-1 text-sm font-medium text-slate-400 uppercase tracking-wider">{network}</p>
                    <button
                        type="button"
                        onClick={copyAddress}
                        className="focus-ring mt-5 inline-flex max-w-full items-center gap-3 rounded-xl bg-white/5 px-4 py-2.5 text-xs font-mono text-slate-300 hover:bg-white/10 hover:text-white transition-all group"
                    >
                        <span className="truncate">{address}</span>
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition-colors ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-slate-400 group-hover:text-white'}`}>
                            {copied ? 'COPIED' : 'COPY'}
                        </span>
                    </button>
                </div>

                <dl className="grid w-full max-w-2xl grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                    <div className="flex flex-col justify-between rounded-2xl bg-bg-dark/40 p-4 border border-white/5 backdrop-blur-sm transition-transform hover:scale-105">
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Supply</dt>
                        <dd className="mt-2 text-xl font-bold text-white">{formatValue(totalSupply)}</dd>
                    </div>
                    <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-accent/10 to-bg-dark/40 p-4 border border-accent/20 backdrop-blur-sm transition-transform hover:scale-105 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-accent">Floor Price</dt>
                        <dd className="mt-2 text-xl font-bold text-white">
                            {floorPrice != null ? `${floorPrice} ${metadata.floorCurrency ?? 'ETH'}` : 'N/A'}
                        </dd>
                    </div>
                    <div className="flex flex-col justify-between rounded-2xl bg-bg-dark/40 p-4 border border-white/5 backdrop-blur-sm transition-transform hover:scale-105">
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Owners</dt>
                        <dd className="mt-2 text-xl font-bold text-white">{formatValue(owners)}</dd>
                    </div>
                    <div className="flex flex-col justify-between rounded-2xl bg-bg-dark/40 p-4 border border-white/5 backdrop-blur-sm transition-transform hover:scale-105">
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Ticker</dt>
                        <dd className="mt-2 text-xl font-bold text-white">{symbol || 'N/A'}</dd>
                    </div>
                </dl>
            </div>
        </section>
    )
}
