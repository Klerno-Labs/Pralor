import Image from 'next/image'
import { useState, memo } from 'react'
import type { NftItem } from '@/types/nft'

type Props = {
    nft: NftItem
    allNfts?: NftItem[]
    isPriority?: boolean
    onClick?: () => void
    isFavorite?: boolean
    onToggleFavorite?: (tokenId: string) => void
}

const FALLBACK_GRADIENTS = [
    'from-accent to-accent-2',
    'from-indigo-500 to-purple-500',
    'from-cyan-400 to-blue-600',
    'from-emerald-400 to-teal-600',
]

function NFTCard({
    nft,
    allNfts,
    isPriority = false,
    onClick,
    isFavorite = false,
    onToggleFavorite,
}: Props) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)

    const tokenLabel = nft.name || `#${nft.tokenIdDecimal}`
    const gradientIndex =
        nft.tokenIdDecimal.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        FALLBACK_GRADIENTS.length
    const gradient = FALLBACK_GRADIENTS[gradientIndex]

    const getTraitRarity = (traitType: string, traitValue: string): number => {
        if (!allNfts || allNfts.length === 0) return 0
        const count = allNfts.filter((n) =>
            n.traits.some((t) => t.type === traitType && String(t.value) === traitValue)
        ).length
        return (count / allNfts.length) * 100
    }

    return (
        <article
            className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border-subtle bg-card-dark backdrop-blur-md shadow-soft transition-all duration-200 hover:border-accent/30 hover:shadow-glow hover:-translate-y-1 hover:scale-[1.02]"
            onClick={onClick}
        >
            <div className="relative aspect-square w-full overflow-hidden bg-bg-dark">
                {nft.imageUrl && !imageError ? (
                    <>
                        {!imageLoaded && (
                            <div className={`absolute inset-0 animate-pulse bg-gradient-to-br ${gradient} opacity-20`} />
                        )}
                        <Image
                            src={nft.imageUrl}
                            alt={tokenLabel}
                            fill
                            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className={`object-cover transition duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            priority={isPriority}
                            loading={isPriority ? 'eager' : 'lazy'}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                            quality={75}
                        />
                    </>
                ) : (
                    <div
                        className={`flex h-full items-center justify-center bg-gradient-to-br ${gradient} text-sm font-semibold text-white/90`}
                    >
                        No media
                    </div>
                )}

                {/* Overlay gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-darker/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                {onToggleFavorite && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleFavorite(nft.tokenId)
                        }}
                        className="pointer-events-auto absolute right-3 top-3 rounded-full bg-black/40 p-2 backdrop-blur-md transition-all hover:bg-black/60 hover:scale-110 active:scale-95"
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <svg
                            className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-white/80 hover:text-white'
                                }`}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </button>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-base font-bold text-slate-100 group-hover:text-accent transition-colors">{tokenLabel}</h3>
                    <div className="flex gap-1.5">
                        {nft.rarityRank && (
                            <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent border border-accent/20">
                                #{nft.rarityRank}
                            </span>
                        )}
                        <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-white/5">
                            {nft.tokenIdDecimal}
                        </span>
                    </div>
                </div>

                {nft.traits?.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5">
                        {nft.traits.slice(0, 3).map((t) => {
                            const rarity = getTraitRarity(t.type, String(t.value))
                            return (
                                <span
                                    key={`${t.type}-${t.value}`}
                                    className="inline-flex max-w-full items-center truncate rounded-md bg-white/5 px-2 py-1 text-[10px] text-slate-300 transition-colors group-hover:bg-white/10"
                                    title={`${t.type}: ${t.value} (${rarity.toFixed(1)}%)`}
                                >
                                    <span className="truncate">{String(t.value)}</span>
                                    {allNfts && (
                                        <span className="ml-1.5 text-accent-2 opacity-80">{rarity.toFixed(0)}%</span>
                                    )}
                                </span>
                            )
                        })}
                        {nft.traits.length > 3 && (
                            <span className="rounded-md bg-white/5 px-1.5 py-1 text-[10px] text-slate-400">
                                +{nft.traits.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </article>
    )
}

export default memo(NFTCard)
