import type { NftItem, CollectionMetadata } from '@/types/nft'

export function exportToJSON(nfts: NftItem[], metadata: CollectionMetadata) {
    const data = {
        collection: {
            name: metadata.name,
            address: metadata.address,
            symbol: metadata.symbol,
            totalSupply: metadata.totalSupply,
            floorPrice: metadata.floorPrice,
            network: metadata.network,
        },
        nfts: nfts.map((nft) => ({
            tokenId: nft.tokenId,
            tokenIdDecimal: nft.tokenIdDecimal,
            name: nft.name,
            imageUrl: nft.imageUrl,
            rarityRank: nft.rarityRank,
            rarityScore: nft.rarityScore,
            traits: nft.traits,
        })),
        exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${metadata.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

export function exportToCSV(nfts: NftItem[], metadata: CollectionMetadata) {
    const headers = ['Token ID', 'Name', 'Rarity Rank', 'Rarity Score', 'Image URL', 'Traits']

    const rows = nfts.map((nft) => {
        const traitsStr = nft.traits
            .map((t) => `${t.type}:${t.value}`)
            .join('; ')

        return [
            nft.tokenIdDecimal,
            nft.name || '',
            nft.rarityRank || '',
            nft.rarityScore?.toFixed(2) || '',
            nft.imageUrl || '',
            traitsStr,
        ]
    })

    const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${metadata.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}
