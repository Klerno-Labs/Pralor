'use client'

import { useMemo } from 'react'
import type { NftItem } from '@/types/nft'

export type TraitFilterState = Record<string, Set<string>>

type Props = {
    nfts: NftItem[]
    filters: TraitFilterState
    onToggle: (traitType: string, value: string) => void
    onClear: () => void
}

export default function FiltersPanel({ nfts, filters, onToggle, onClear }: Props) {
    const traitsMap = useMemo(() => {
        const map: Record<string, Record<string, number>> = {}
        for (const nft of nfts) {
            for (const trait of nft.traits) {
                const type = trait.type || 'Trait'
                const value = String(trait.value ?? 'Unknown')
                if (!map[type]) map[type] = {}
                map[type][value] = (map[type][value] || 0) + 1
            }
        }
        return map
    }, [nfts])

    const activeFiltersCount = Object.values(filters).reduce((total, set) => total + set.size, 0)
    const hasFilters = activeFiltersCount > 0

    if (!nfts.length) return null

    const sortedTraitEntries = Object.entries(traitsMap).sort(([a], [b]) => a.localeCompare(b))

    return (
        <aside className="glass w-full max-w-xs rounded-3xl p-4 text-sm shadow-soft">
            <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                        Attribute Filters
                    </h3>
                    <p className="text-[11px] text-slate-500">
                        {hasFilters ? `${activeFiltersCount} filters active` : 'Narrow by traits instantly'}
                    </p>
                </div>
                {hasFilters && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="focus-ring rounded-full px-3 py-1 text-[11px] font-semibold text-accent hover:bg-white/5"
                    >
                        Clear all
                    </button>
                )}
            </div>
            <div className="flex max-h-[460px] flex-col gap-3 overflow-y-auto pr-1">
                {sortedTraitEntries.map(([traitType, values]) => {
                    const entries = Object.entries(values).sort(([, aCount], [, bCount]) => bCount - aCount)
                    return (
                        <div key={traitType} className="rounded-2xl bg-white/5 p-3">
                            <div className="flex items-center justify-between gap-2">
                                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                                    {traitType}
                                </div>
                                <span className="text-[11px] text-slate-500">{entries.length} values</span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {entries.map(([value, count]) => {
                                    const active = filters[traitType]?.has(value)
                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => onToggle(traitType, value)}
                                            className={`focus-ring rounded-full border px-3 py-1 text-[11px] transition ${active
                                                    ? 'border-accent/70 bg-accent/15 text-accent'
                                                    : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/30'
                                                }`}
                                        >
                                            {value}{' '}
                                            <span className="ml-1 text-slate-500" aria-hidden>
                                                ({count})
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </aside>
    )
}
