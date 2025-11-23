"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import type { NftItem } from '@/types/nft'
import NFTCard from './NFTCard'

type Props = {
  nfts: NftItem[]
  allNfts?: NftItem[]
  emptyMessage?: string
  onNftClick?: (nft: NftItem) => void
  isFavorite?: (tokenId: string) => boolean
  onToggleFavorite?: (tokenId: string) => void
  onBack?: () => void
}

export default function VirtualizedNFTGrid({
  nfts,
  allNfts,
  emptyMessage = 'No NFTs to display.',
  onNftClick,
  isFavorite,
  onToggleFavorite,
  onBack,
}: Props) {
  const router = useRouter()
  if (!nfts || nfts.length === 0) {
    return (
      <div>
        <div className="flex min-h-[200px] items-center justify-center rounded-3xl border border-border-subtle bg-card-dark/50 text-sm text-slate-400">
          {emptyMessage}
        </div>
      </div>
    )
  }
  
  return (
    <div className="w-full">
      <div className="mb-4" />
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {nfts.map((nft) => (
          <div key={nft.tokenId} className="w-full">
            <NFTCard
              nft={nft}
              allNfts={allNfts}
              isPriority={false}
              onClick={() => onNftClick?.(nft)}
              isFavorite={isFavorite?.(nft.tokenId)}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

