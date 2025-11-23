export type TokenMetadata = {
    address: `0x${string}`
    symbol: string
    decimals: number
}

export type TokenBalance = {
    token: TokenMetadata
    rawBalance: bigint
    formatted: string
}

export type NftItem = {
    contractAddress: `0x${string}`
    tokenId: string
    name: string
    imageUrl?: string | null
    collectionName?: string | null
}
