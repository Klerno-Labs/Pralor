import type { NftItem } from '@/types/nft'

type TraitFrequency = {
    [traitType: string]: {
        [traitValue: string]: number
    }
}

// Memoize the last calculation to avoid re-computing if the input array reference hasn't changed
// This is a simple optimization for when React re-renders but data is same
let lastNfts: NftItem[] | null = null
let lastResult: NftItem[] | null = null

export function calculateRarityScores(nfts: NftItem[]): NftItem[] {
    if (nfts.length === 0) return nfts
    if (nfts === lastNfts && lastResult) return lastResult

    // Step 1: Calculate trait frequencies
    // Use a single pass to build frequency map
    const traitFrequency: TraitFrequency = {}
    const totalNfts = nfts.length

    for (const nft of nfts) {
        for (const trait of nft.traits) {
            const traitType = trait.type
            const traitValue = String(trait.value ?? 'None')

            if (!traitFrequency[traitType]) {
                traitFrequency[traitType] = {}
            }
            const typeFreq = traitFrequency[traitType]
            typeFreq[traitValue] = (typeFreq[traitValue] || 0) + 1
        }
    }

    // Step 2: Calculate rarity score for each NFT
    // Pre-calculate rarity weights for O(1) lookup
    const rarityWeights: { [key: string]: number } = {}

    for (const type in traitFrequency) {
        for (const value in traitFrequency[type]) {
            const frequency = traitFrequency[type][value]
            // Rarity score = 1 / (frequency / total) = total / frequency
            rarityWeights[`${type}:${value}`] = totalNfts / frequency
        }
    }

    const nftsWithScores = nfts.map((nft) => {
        let rarityScore = 0
        for (const trait of nft.traits) {
            const key = `${trait.type}:${String(trait.value ?? 'None')}`
            rarityScore += rarityWeights[key] || 0
        }
        return { ...nft, rarityScore }
    })

    // Step 3: Assign rarity ranks (1 = rarest)
    // Sort is O(N log N)
    const sorted = [...nftsWithScores].sort((a, b) => (b.rarityScore || 0) - (a.rarityScore || 0))

    // Create a map for O(1) rank lookup instead of O(N^2) findIndex
    const rankMap = new Map<string, number>()
    sorted.forEach((nft, index) => {
        rankMap.set(nft.tokenId, index + 1)
    })

    const finalResult = nftsWithScores.map((nft) => ({
        ...nft,
        rarityRank: rankMap.get(nft.tokenId)
    }))

    lastNfts = nfts
    lastResult = finalResult

    return finalResult
}

export function getTraitRarity(nfts: NftItem[], traitType: string, traitValue: string): number {
    if (nfts.length === 0) return 0

    let count = 0
    for (const nft of nfts) {
        for (const t of nft.traits) {
            if (t.type === traitType && String(t.value) === traitValue) {
                count++
                break
            }
        }
    }

    return (count / nfts.length) * 100
}
