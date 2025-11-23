'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AutomationEvent {
    type: string
    amount: string
    tokenSymbol: string
    walletAddress: string
    timestamp: string
    receivedAt?: string
}

export default function EventFeed() {
    const [events, setEvents] = useState<AutomationEvent[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const r = await fetch('/api/events')
                const j = await r.json()
                setEvents(j.events)
            } catch (e) {
                console.error('Failed to fetch events', e)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
        const i = setInterval(fetchEvents, 3000)
        return () => clearInterval(i)
    }, [])

    return (
        <div className="space-y-3">
            {loading && events.length === 0 && (
                <div className="text-center text-slate-400 py-8">Loading events...</div>
            )}

            {!loading && events.length === 0 && (
                <div className="text-center text-slate-400 py-8">No events yet</div>
            )}

            <AnimatePresence mode="popLayout">
                {events.map((e, i) => (
                    <motion.div
                        key={`${e.timestamp}-${i}`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur hover:bg-slate-800/50 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <div className="font-bold text-slate-200">{e.type}</div>
                            <div className="text-xs text-slate-500 font-mono">
                                {new Date(e.timestamp || e.receivedAt || '').toLocaleTimeString()}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-accent font-medium">
                                {e.amount} {e.tokenSymbol}
                            </div>
                            <div className="text-xs text-slate-400 font-mono bg-slate-900/50 px-2 py-1 rounded">
                                {e.walletAddress}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
