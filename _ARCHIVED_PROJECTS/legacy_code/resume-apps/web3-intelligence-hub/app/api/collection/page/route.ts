import { NextRequest, NextResponse } from 'next/server'
import { fetchNftCollection, fetchCollectionMetadata } from '@/lib/api/alchemy'
import { calculateRarityScores } from '@/lib/rarity'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, pageKey } = body

    if (!address) {
      return NextResponse.json(
        { error: 'Contract address is required' },
        { status: 400 }
      )
    }

    if (!pageKey) {
      return NextResponse.json(
        { error: 'Page key is required for pagination' },
        { status: 400 }
      )
    }

    // Validate address format
    if (!address.startsWith('0x') || address.length !== 42) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address format' },
        { status: 400 }
      )
    }

    // Fetch NFTs with pagination
    const nftData = await fetchNftCollection(address, pageKey)

    // Calculate rarity scores for the fetched NFTs
    const nftsWithRarity = calculateRarityScores(nftData.nfts)

    // Get metadata for totalSupply if needed
    const collectionData = await fetchCollectionMetadata(address)

    return NextResponse.json({
      nfts: nftsWithRarity,
      metadata: collectionData,
      pageKey: nftData.nextPageKey || null,
      totalCount: collectionData?.totalSupply || null,
    })
  } catch (error) {
    console.error('NFT Pagination API Error:', error)

    const message = error instanceof Error ? error.message : 'Failed to fetch next page'
    const status = message.includes('not configured') ? 503 : 500

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}
