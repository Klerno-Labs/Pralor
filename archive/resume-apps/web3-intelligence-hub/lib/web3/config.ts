import { http, createConfig, createStorage, cookieStorage } from 'wagmi'
import { mainnet, sepolia, polygon, arbitrum, optimism, base } from 'wagmi/chains'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
  trustWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets'
import type { TrackedToken } from '@/types'

// RPC URL from environment or fallback to public endpoints
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''
const appName = 'Web3 Intelligence Hub'

// Define chains with const assertion for type safety
export const chains = [mainnet, polygon, arbitrum, optimism, base, sepolia] as const

// Configure wallets using RainbowKit
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
        rainbowWallet,
      ],
    },
    {
      groupName: 'More',
      wallets: [
        trustWallet,
        injectedWallet,
      ],
    },
  ],
  {
    appName,
    projectId: walletConnectProjectId,
  }
)

export const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(rpcUrl || undefined),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
  connectors,
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
})

// Chain info helper
export const chainInfo: Record<number, { name: string; color: string; icon: string }> = {
  1: { name: 'Ethereum', color: '#627EEA', icon: 'ETH' },
  137: { name: 'Polygon', color: '#8247E5', icon: 'MATIC' },
  42161: { name: 'Arbitrum', color: '#28A0F0', icon: 'ARB' },
  10: { name: 'Optimism', color: '#FF0420', icon: 'OP' },
  8453: { name: 'Base', color: '#0052FF', icon: 'BASE' },
  11155111: { name: 'Sepolia', color: '#CFB5F0', icon: 'SEP' },
}

// Common ERC-20 tokens to track
export const TRACKED_TOKENS: TrackedToken[] = [
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as `0x${string}`,
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  },
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as `0x${string}`,
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as `0x${string}`,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logoUrl: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
  },
] as const
