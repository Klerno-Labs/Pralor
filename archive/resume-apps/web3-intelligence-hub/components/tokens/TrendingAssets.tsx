'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TrendingAsset {
    id: string
    rank: number
    name: string
    symbol: string
    price: number
    change24h: number
    volume24h: number
    buyPercent: number
    sellPercent: number
    image: string
}

// Simulated trending assets with buy/sell sentiment
const MOCK_ASSETS: Omit<TrendingAsset, 'buyPercent' | 'sellPercent' | 'change24h'>[] = [
    { id: 'bitcoin', rank: 1, name: 'Bitcoin', symbol: 'BTC', price: 97500, volume24h: 45000000000, image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
    { id: 'ethereum', rank: 2, name: 'Ethereum', symbol: 'ETH', price: 3650, volume24h: 22000000000, image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { id: 'solana', rank: 3, name: 'Solana', symbol: 'SOL', price: 245, volume24h: 8500000000, image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
    { id: 'ripple', rank: 4, name: 'XRP', symbol: 'XRP', price: 1.42, volume24h: 12000000000, image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
    { id: 'dogecoin', rank: 5, name: 'Dogecoin', symbol: 'DOGE', price: 0.41, volume24h: 6500000000, image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
    { id: 'cardano', rank: 6, name: 'Cardano', symbol: 'ADA', price: 1.05, volume24h: 3200000000, image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
    { id: 'avalanche', rank: 7, name: 'Avalanche', symbol: 'AVAX', price: 42.50, volume24h: 1800000000, image: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png' },
    { id: 'chainlink', rank: 8, name: 'Chainlink', symbol: 'LINK', price: 18.75, volume24h: 1200000000, image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
    { id: 'polkadot', rank: 9, name: 'Polkadot', symbol: 'DOT', price: 8.90, volume24h: 950000000, image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png' },
    { id: 'polygon', rank: 10, name: 'Polygon', symbol: 'MATIC', price: 0.52, volume24h: 720000000, image: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png' },
]

function generateSentiment(): { buyPercent: number; sellPercent: number; change24h: number } {
    // Generate realistic buy/sell percentages that add up to 100
    const buyPercent = Math.floor(35 + Math.random() * 40) // 35-75%
    const sellPercent = 100 - buyPercent
    const change24h = (Math.random() - 0.45) * 15 // -6.75% to +8.25% bias slightly positive
    return { buyPercent, sellPercent, change24h }
}

function formatVolume(value: number): string {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
    return `$${value.toLocaleString()}`
}

function formatPrice(price: number): string {
    if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    if (price >= 1) return `$${price.toFixed(2)}`
    return `$${price.toFixed(4)}`
}

export default function TrendingAssets() {
    const [assets, setAssets] = useState<TrendingAsset[]>([])
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    const generateAssets = () => {
        return MOCK_ASSETS.map((asset, idx) => ({
            ...asset,
            rank: idx + 1,
            price: asset.price * (0.98 + Math.random() * 0.04), // +/- 2% variation
            volume24h: asset.volume24h * (0.9 + Math.random() * 0.2),
            ...generateSentiment(),
        }))
    }

    useEffect(() => {
        setAssets(generateAssets())
        setLastUpdate(new Date())

        // Update every 30 seconds
        const interval = setInterval(() => {
            setIsUpdating(true)
            setTimeout(() => {
                setAssets(generateAssets())
                setLastUpdate(new Date())
                setIsUpdating(false)
            }, 500)
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Trending Assets
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : 'Loading...'}
                        {isUpdating && <span className="ml-2 text-accent animate-pulse">Updating...</span>}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">LIVE</span>
                </div>
            </div>

            {/* Legend */}
            <div className="px-4 py-2 bg-slate-900/30 border-b border-border-subtle flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                    <span className="text-slate-400">Buyers</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                    <span className="text-slate-400">Sellers</span>
                </div>
            </div>

            <div className="divide-y divide-border-subtle/50">
                {assets.map((asset, idx) => (
                    <motion.div
                        key={asset.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            {/* Rank & Icon */}
                            <div className="flex items-center gap-3 w-32 shrink-0">
                                <span className={`text-sm font-bold w-5 ${asset.rank <= 3 ? 'text-accent' : 'text-slate-500'}`}>
                                    {asset.rank}
                                </span>
                                <img
                                    src={asset.image}
                                    alt={asset.name}
                                    className="w-8 h-8 rounded-full"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${asset.symbol}&background=6366f1&color=fff&size=32`
                                    }}
                                />
                                <div className="min-w-0">
                                    <div className="font-medium text-slate-200 truncate">{asset.name}</div>
                                    <div className="text-xs text-slate-500">{asset.symbol}</div>
                                </div>
                            </div>

                            {/* Price & Change */}
                            <div className="w-28 shrink-0 text-right">
                                <div className="font-medium text-slate-200">{formatPrice(asset.price)}</div>
                                <div className={`text-xs ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                                </div>
                            </div>

                            {/* Volume */}
                            <div className="w-24 shrink-0 text-right hidden sm:block">
                                <div className="text-xs text-slate-500">24h Vol</div>
                                <div className="text-sm text-slate-300">{formatVolume(asset.volume24h)}</div>
                            </div>

                            {/* Buy/Sell Sentiment Bar */}
                            <div className="flex-1 min-w-[200px]">
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="text-emerald-400 font-medium">{asset.buyPercent}% Buy</span>
                                    <span className="text-red-400 font-medium">{asset.sellPercent}% Sell</span>
                                </div>
                                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                                    <motion.div
                                        className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${asset.buyPercent}%` }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                    />
                                    <motion.div
                                        className="bg-gradient-to-r from-red-400 to-red-600 h-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${asset.sellPercent}%` }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-3 bg-slate-900/30 text-center border-t border-border-subtle">
                <p className="text-xs text-slate-500">
                    Sentiment data is simulated for demonstration purposes
                </p>
            </div>
        </div>
    )
}
