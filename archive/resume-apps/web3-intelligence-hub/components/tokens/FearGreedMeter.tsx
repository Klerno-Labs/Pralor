'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface FearGreedData {
    value: number
    classification: string
    timestamp: number
    timeUntilUpdate: number
}

function getColorForValue(value: number): string {
    if (value <= 25) return '#ef4444' // red - extreme fear
    if (value <= 45) return '#f97316' // orange - fear
    if (value <= 55) return '#eab308' // yellow - neutral
    if (value <= 75) return '#84cc16' // lime - greed
    return '#22c55e' // green - extreme greed
}

function getGradientForValue(value: number): string {
    if (value <= 25) return 'from-red-600 to-red-400'
    if (value <= 45) return 'from-orange-600 to-orange-400'
    if (value <= 55) return 'from-yellow-600 to-yellow-400'
    if (value <= 75) return 'from-lime-600 to-lime-400'
    return 'from-emerald-600 to-emerald-400'
}

function getTextColorForValue(value: number): string {
    if (value <= 25) return 'text-red-400'
    if (value <= 45) return 'text-orange-400'
    if (value <= 55) return 'text-yellow-400'
    if (value <= 75) return 'text-lime-400'
    return 'text-emerald-400'
}

export default function FearGreedMeter() {
    const [data, setData] = useState<FearGreedData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastFetch, setLastFetch] = useState<Date | null>(null)

    const fetchFearGreed = async () => {
        try {
            const response = await fetch('https://api.alternative.me/fng/')
            if (!response.ok) throw new Error('Failed to fetch')

            const json = await response.json()
            const item = json.data[0]

            setData({
                value: parseInt(item.value, 10),
                classification: item.value_classification,
                timestamp: parseInt(item.timestamp, 10) * 1000,
                timeUntilUpdate: parseInt(item.time_until_update, 10)
            })
            setLastFetch(new Date())
            setError(null)
        } catch (err) {
            setError('Unable to fetch data')
            console.error('Fear & Greed fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFearGreed()

        // Refresh every 5 minutes
        const interval = setInterval(fetchFearGreed, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    // Calculate needle rotation (-90 to 90 degrees for 0-100 value)
    const needleRotation = data ? (data.value / 100) * 180 - 90 : -90

    return (
        <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Fear & Greed Index
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {lastFetch ? `Updated ${lastFetch.toLocaleTimeString()}` : 'Loading...'}
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

            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                        <svg className="w-8 h-8 mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-sm">{error}</p>
                        <button
                            onClick={fetchFearGreed}
                            className="mt-2 text-xs text-accent hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                ) : data && (
                    <div className="flex flex-col items-center">
                        {/* Gauge */}
                        <div className="relative w-48 h-24 mb-4">
                            {/* Background arc */}
                            <svg className="w-full h-full" viewBox="0 0 200 100">
                                {/* Gradient definitions */}
                                <defs>
                                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#ef4444" />
                                        <stop offset="25%" stopColor="#f97316" />
                                        <stop offset="50%" stopColor="#eab308" />
                                        <stop offset="75%" stopColor="#84cc16" />
                                        <stop offset="100%" stopColor="#22c55e" />
                                    </linearGradient>
                                </defs>

                                {/* Background arc */}
                                <path
                                    d="M 20 95 A 80 80 0 0 1 180 95"
                                    fill="none"
                                    stroke="#1e293b"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                />

                                {/* Colored arc */}
                                <path
                                    d="M 20 95 A 80 80 0 0 1 180 95"
                                    fill="none"
                                    stroke="url(#gaugeGradient)"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                />

                                {/* Tick marks */}
                                {[0, 25, 50, 75, 100].map((tick) => {
                                    const angle = (tick / 100) * 180 - 180
                                    const radian = (angle * Math.PI) / 180
                                    const x1 = 100 + 70 * Math.cos(radian)
                                    const y1 = 95 + 70 * Math.sin(radian)
                                    const x2 = 100 + 60 * Math.cos(radian)
                                    const y2 = 95 + 60 * Math.sin(radian)
                                    return (
                                        <line
                                            key={tick}
                                            x1={x1}
                                            y1={y1}
                                            x2={x2}
                                            y2={y2}
                                            stroke="#475569"
                                            strokeWidth="2"
                                        />
                                    )
                                })}
                            </svg>

                            {/* Needle */}
                            <motion.div
                                className="absolute bottom-0 left-1/2 origin-bottom"
                                style={{
                                    width: '4px',
                                    height: '70px',
                                    marginLeft: '-2px'
                                }}
                                initial={{ rotate: -90 }}
                                animate={{ rotate: needleRotation }}
                                transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                            >
                                <div
                                    className="w-full h-full rounded-full"
                                    style={{
                                        background: `linear-gradient(to top, ${getColorForValue(data.value)}, ${getColorForValue(data.value)}dd)`,
                                        boxShadow: `0 0 10px ${getColorForValue(data.value)}80`
                                    }}
                                />
                            </motion.div>

                            {/* Center dot */}
                            <div
                                className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full -translate-x-1/2 translate-y-1/2"
                                style={{
                                    backgroundColor: getColorForValue(data.value),
                                    boxShadow: `0 0 15px ${getColorForValue(data.value)}80`
                                }}
                            />
                        </div>

                        {/* Value display */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className={`text-5xl font-bold ${getTextColorForValue(data.value)}`}>
                                {data.value}
                            </div>
                            <div className={`text-lg font-semibold mt-1 ${getTextColorForValue(data.value)}`}>
                                {data.classification}
                            </div>
                        </motion.div>

                        {/* Scale labels */}
                        <div className="flex justify-between w-full mt-6 text-xs">
                            <div className="text-center">
                                <div className="text-red-400 font-medium">0</div>
                                <div className="text-slate-500">Extreme Fear</div>
                            </div>
                            <div className="text-center">
                                <div className="text-yellow-400 font-medium">50</div>
                                <div className="text-slate-500">Neutral</div>
                            </div>
                            <div className="text-center">
                                <div className="text-emerald-400 font-medium">100</div>
                                <div className="text-slate-500">Extreme Greed</div>
                            </div>
                        </div>

                        {/* Historical context hint */}
                        <div className="mt-6 p-3 bg-slate-900/50 rounded-lg w-full">
                            <p className="text-xs text-slate-400 text-center">
                                The index ranges from 0 (Extreme Fear) to 100 (Extreme Greed).
                                Fear indicates a buying opportunity, while greed may signal a market correction.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 bg-slate-900/30 text-center border-t border-border-subtle">
                <p className="text-xs text-slate-500">
                    Data from Alternative.me Fear & Greed Index
                </p>
            </div>
        </div>
    )
}
