'use client'

import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import SectionHeader from './SectionHeader'
import { fetchNftsForOwner } from '@/lib/wallet/nfts'
import type { NftItem } from '@/lib/wallet/types'

function NftCard({ nft }: { nft: NftItem }) {
    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-card-dark/80 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:border-accent/70 hover:shadow-2xl">
            <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
                {nft.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={nft.imageUrl}
                        alt={nft.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-[11px] text-slate-500">
                        No image
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col p-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate font-medium text-slate-50">{nft.name}</h3>
                    <span className="rounded-full bg-slate-900/80 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                        #{nft.tokenId}
                    </span>
                </div>
                {nft.collectionName && (
                    <p className="mt-1 text-[11px] text-slate-400">{nft.collectionName}</p>
                )}
            </div>
        </article>
    )
}

export default function NftGrid() {
    const { address, isConnected } = useAccount()

    const { data, isLoading } = useQuery({
        queryKey: ['nfts', address],
        queryFn: () => fetchNftsForOwner(address as `0x${string}`),
        enabled: !!address,
    })

    return (
        <section className="rounded-2xl border border-slate-800 bg-card-dark/80 p-4 shadow-soft backdrop-blur">
            <SectionHeader
                title="NFTs"
                subtitle="Gallery of NFTs for the connected wallet."
            />
            <div className="mt-3 text-xs">
                {!isConnected && (
                    <p className="text-slate-400">
                        Connect a wallet to load NFTs.
                    </p>
                )}
                {isConnected && isLoading && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-40 animate-pulse rounded-2xl bg-slate-900/70"
                            />
                        ))}
                    </div>
                )}
                {isConnected && !isLoading && data && data.length === 0 && (
                    <p className="text-slate-400">
                        No NFTs found.
                    </p>
                )}
                {isConnected && !isLoading && data && data.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {data.map((nft) => (
                            <NftCard key={`${nft.contractAddress}-${nft.tokenId}`} nft={nft} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
