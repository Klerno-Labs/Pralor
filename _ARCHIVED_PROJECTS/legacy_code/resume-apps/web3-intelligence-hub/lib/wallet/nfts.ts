import type { NftItem } from '@/lib/wallet/types'

// Placeholder NFT helper.
// You can wire this to Alchemy, SimpleHash, OpenSea, or any NFT indexer API
// and return a typed list of NFTs for the connected wallet.

export async function fetchNftsForOwner(_address: string): Promise<NftItem[]> {
    // For now this returns an empty array and the UI will show a friendly message.
    // Plug in your favorite NFT API here later.
    return []
}
