import type { TokenMetadata } from '@/lib/wallet/types'

// A small curated list of blue-chip ERC-20 tokens on Ethereum mainnet.
export const TRACKED_TOKENS: TokenMetadata[] = [
    {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        symbol: 'USDC',
        decimals: 6,
    },
    {
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        symbol: 'USDT',
        decimals: 6,
    },
    {
        address: '0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2',
        symbol: 'WETH',
        decimals: 18,
    },
    {
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        symbol: 'DAI',
        decimals: 18,
    },
]
