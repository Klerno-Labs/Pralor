import type { NftItem, CollectionMetadata } from '@/types/nft'

// Alchemy API configuration
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
const ALCHEMY_NETWORK = process.env.ALCHEMY_NETWORK || 'eth-mainnet'
const ALCHEMY_BASE_URL = `https://${ALCHEMY_NETWORK}.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}`

interface AlchemyNft {
  tokenId: string
  name?: string
  description?: string
  image?: {
    cachedUrl?: string
    thumbnailUrl?: string
    originalUrl?: string
  }
  raw?: {
    metadata?: {
      name?: string
      description?: string
      image?: string
      attributes?: Array<{
        trait_type?: string
        value?: string | number
      }>
    }
  }
}

interface AlchemyResponse {
  nfts: AlchemyNft[]
  pageKey?: string
  validAt?: {
    blockNumber: number
    blockTimestamp: string
  }
}

interface AlchemyContractMetadata {
  name?: string
  symbol?: string
  totalSupply?: string
  openSeaMetadata?: {
    floorPrice?: number
    collectionName?: string
    description?: string
    bannerImageUrl?: string
  }
}

/**
 * Fetches NFTs from a collection with pagination
 */
export async function fetchNftCollection(
  contractAddress: string,
  pageKey?: string
): Promise<{ nfts: NftItem[]; nextPageKey?: string }> {
  if (!ALCHEMY_API_KEY) {
    throw new Error('ALCHEMY_API_KEY is not configured')
  }

  const params = new URLSearchParams({
    contractAddress,
    withMetadata: 'true',
    limit: '20',
  })

  if (pageKey) {
    params.set('startToken', pageKey)
  }

  const url = `${ALCHEMY_BASE_URL}/getNFTsForContract?${params}`

  const res = await fetch(url, {
    headers: { accept: 'application/json' },
    next: { revalidate: 300 }, // Cache for 5 minutes
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Alchemy API error: ${res.status} - ${error}`)
  }

  const data: AlchemyResponse = await res.json()

  const nfts: NftItem[] = data.nfts.map((nft) => ({
    tokenId: nft.tokenId,
    tokenIdDecimal: nft.tokenId,
    name: nft.name || nft.raw?.metadata?.name || `#${nft.tokenId}`,
    imageUrl:
      nft.image?.cachedUrl ||
      nft.image?.thumbnailUrl ||
      nft.image?.originalUrl ||
      nft.raw?.metadata?.image ||
      null,
    traits: (nft.raw?.metadata?.attributes || [])
      .filter((attr) => attr.trait_type && attr.value !== undefined)
      .map((attr) => ({
        type: attr.trait_type!,
        value: String(attr.value),
      })),
  }))

  return {
    nfts,
    nextPageKey: data.pageKey,
  }
}

/**
 * Fetches collection metadata
 */
export async function fetchCollectionMetadata(
  contractAddress: string
): Promise<CollectionMetadata | null> {
  if (!ALCHEMY_API_KEY) {
    throw new Error('ALCHEMY_API_KEY is not configured')
  }

  const url = `${ALCHEMY_BASE_URL}/getContractMetadata?contractAddress=${contractAddress}`

  const res = await fetch(url, {
    headers: { accept: 'application/json' },
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!res.ok) {
    return null
  }

  const data: AlchemyContractMetadata = await res.json()

  return {
    address: contractAddress,
    name: data.name || data.openSeaMetadata?.collectionName || 'Unknown Collection',
    symbol: data.symbol || null,
    totalSupply: data.totalSupply ? parseInt(data.totalSupply) : null,
    floorPrice: data.openSeaMetadata?.floorPrice || null,
    floorCurrency: data.openSeaMetadata?.floorPrice ? 'ETH' : null,
    description: data.openSeaMetadata?.description || null,
    externalUrl: null,
    owners: null,
    network: ALCHEMY_NETWORK,
  }
}

/**
 * Exports NFT data to JSON
 */
export function exportToJson(nfts: NftItem[]): string {
  return JSON.stringify(nfts, null, 2)
}

/**
 * Exports NFT data to CSV
 */
export function exportToCsv(nfts: NftItem[]): string {
  const headers = ['Token ID', 'Name', 'Rarity Score', 'Traits']
  const rows = nfts.map((nft) => [
    nft.tokenId,
    `"${nft.name || ''}"`,
    nft.rarityScore?.toString() || '',
    `"${nft.traits.map((t) => `${t.type}:${t.value}`).join(', ')}"`,
  ])

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
}
