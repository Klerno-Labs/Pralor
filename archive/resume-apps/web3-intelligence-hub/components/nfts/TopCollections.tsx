'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { POPULAR_COLLECTIONS } from '@/lib/constants/collections'

interface Collection {
    rank: number
    name: string
    symbol: string
    address: string
    floorPrice: number
    volume24h: number
    change24h: number
    owners: number
    items: number
}

// Simulated top collections data with realistic values
const generateCollections = (): Collection[] => {
    // Use only collections that have floor/volume data (first 10)
    const baseCollections = POPULAR_COLLECTIONS.filter(c => c.baseFloor && c.baseVolume).slice(0, 10)

    return baseCollections.map((col, index) => {
        const floorVariation = (Math.random() - 0.5) * 0.1
        const volumeVariation = (Math.random() - 0.5) * 0.2
        const changeVariation = (Math.random() - 0.5) * 30

        return {
            rank: index + 1,
            name: col.name,
            symbol: col.symbol,
            address: col.address,
            floorPrice: (col.baseFloor ?? 1) * (1 + floorVariation),
            volume24h: (col.baseVolume ?? 100) * (1 + volumeVariation),
            change24h: changeVariation,
            owners: (col.owners ?? 1000) + Math.floor(Math.random() * 100 - 50),
            items: col.items ?? 10000,
        }
    })
}

type Props = {
    onSelectCollection: (address: string) => void
}

export default function TopCollections({ onSelectCollection }: Props) {
    const [collections, setCollections] = useState<Collection[]>([])
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        // Initial load
        setCollections(generateCollections())
        setLastUpdate(new Date())

        // Update every 30 seconds
        const interval = setInterval(() => {
            setIsUpdating(true)
            setTimeout(() => {
                const newData = generateCollections()
                // Sort by volume to simulate ranking changes
                newData.sort((a, b) => b.volume24h - a.volume24h)
                newData.forEach((col, idx) => col.rank = idx + 1)
                setCollections(newData)
                setLastUpdate(new Date())
                setIsUpdating(false)
            }, 500)
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    const sortedCollections = useMemo(() => {
        return [...collections].sort((a, b) => a.rank - b.rank).slice(0, 10)
    }, [collections])

    return (
        <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Top 10 Collections
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

            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="text-xs text-slate-500 border-b border-border-subtle">
                            <th className="text-left py-3 px-4 font-medium">#</th>
                            <th className="text-left py-3 px-4 font-medium">Collection</th>
                            <th className="text-right py-3 px-4 font-medium">Floor</th>
                            <th className="text-right py-3 px-4 font-medium">24h Vol</th>
                            <th className="text-right py-3 px-4 font-medium">24h %</th>
                            <th className="text-right py-3 px-4 font-medium">Owners</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {sortedCollections.map((collection) => (
                                <motion.tr
                                    key={collection.address}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => onSelectCollection(collection.address)}
                                    className="border-b border-border-subtle/50 hover:bg-white/5 cursor-pointer transition-colors group"
                                >
                                    <td className="py-3 px-4">
                                        <span className={`text-sm font-bold ${collection.rank <= 3 ? 'text-accent' : 'text-slate-400'}`}>
                                            {collection.rank}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center text-xs font-bold text-accent border border-accent/20">
                                                {collection.symbol.slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-200 group-hover:text-white transition-colors">
                                                    {collection.name}
                                                </div>
                                                <div className="text-xs text-slate-500">{collection.items.toLocaleString()} items</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <span className="font-medium text-slate-200">
                                            {collection.floorPrice.toFixed(2)} ETH
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <span className="text-slate-300">
                                            {collection.volume24h.toFixed(0)} ETH
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <span className={`font-medium ${collection.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {collection.change24h >= 0 ? '+' : ''}{collection.change24h.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <span className="text-slate-400">
                                            {collection.owners.toLocaleString()}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            <div className="p-3 bg-slate-900/30 text-center">
                <p className="text-xs text-slate-500">
                    Click any collection to explore its NFTs
                </p>
            </div>
        </div>
    )
}
