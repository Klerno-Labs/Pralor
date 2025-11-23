'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import type { NftItem } from '@/types/nft'

type Props = {
    nft: NftItem
    allNfts?: NftItem[]
    isOpen: boolean
    onClose: () => void
}

export default function NFTDetailModal({ nft, allNfts, isOpen, onClose }: Props) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const tokenLabel = nft.name || `#${nft.tokenIdDecimal}`

    const getTraitRarity = (traitType: string, traitValue: string): number => {
        if (!allNfts || allNfts.length === 0) return 0
        const count = allNfts.filter((n) =>
            n.traits.some((t) => t.type === traitType && String(t.value) === traitValue)
        ).length
        return (count / allNfts.length) * 100
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-border-subtle bg-card-dark shadow-glow"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                    aria-label="Close modal"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Image Section */}
                    <div className="relative aspect-square w-full bg-slate-900 md:aspect-auto md:min-h-[600px]">
                        {nft.imageUrl ? (
                            <Image
                                src={nft.imageUrl}
                                alt={tokenLabel}
                                fill
                                className="object-cover"
                                sizes="(min-width: 768px) 50vw, 100vw"
                                priority
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent to-accent-2 text-lg font-semibold text-white">
                                No media
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex max-h-[600px] flex-col overflow-y-auto p-6">
                        <div className="mb-4">
                            <h2 className="text-3xl font-bold">{tokenLabel}</h2>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <span className="rounded-full bg-white/5 px-3 py-1 text-sm font-mono text-slate-400">
                                    Token ID: {nft.tokenIdDecimal}
                                </span>
                                {nft.rarityRank && (
                                    <span className="rounded-full bg-accent/20 px-3 py-1 text-sm font-semibold text-accent">
                                        Rank #{nft.rarityRank}
                                    </span>
                                )}
                                {nft.rarityScore && (
                                    <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300">
                                        Score: {nft.rarityScore.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Traits */}
                        {nft.traits?.length > 0 && (
                            <div>
                                <h3 className="mb-3 text-lg font-semibold">Traits</h3>
                                <div className="grid gap-3">
                                    {nft.traits.map((trait) => {
                                        const rarity = getTraitRarity(trait.type, String(trait.value))
                                        return (
                                            <div
                                                key={`${trait.type}-${trait.value}`}
                                                className="rounded-2xl border border-border-subtle bg-white/5 p-4"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="text-xs uppercase tracking-wide text-slate-400">
                                                            {trait.type}
                                                        </div>
                                                        <div className="mt-1 font-semibold text-slate-200">{String(trait.value)}</div>
                                                    </div>
                                                    {allNfts && (
                                                        <div className="text-right">
                                                            <div className="text-sm font-semibold text-accent">{rarity.toFixed(1)}%</div>
                                                            <div className="text-xs text-slate-400">have this</div>
                                                        </div>
                                                    )}
                                                </div>
                                                {allNfts && (
                                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                                                        <div
                                                            className="h-full bg-accent transition-all"
                                                            style={{ width: `${Math.min(rarity, 100)}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
