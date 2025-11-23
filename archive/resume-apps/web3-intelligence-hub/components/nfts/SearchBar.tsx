'use client'

import { useState, useEffect, useRef } from 'react'
import { POPULAR_COLLECTIONS, type NFTCollection } from '@/lib/constants/collections'

type Props = {
    onSearch: (address: string) => void
    loading?: boolean
}

export default function SearchBar({ onSearch, loading = false }: Props) {
    const [value, setValue] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [suggestions, setSuggestions] = useState<NFTCollection[]>([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)
    const suggestionsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (value.length > 0 && !value.startsWith('0x')) {
            const filtered = POPULAR_COLLECTIONS.filter(
                c => c.name.toLowerCase().includes(value.toLowerCase()) ||
                    c.symbol.toLowerCase().includes(value.toLowerCase())
            )
            setSuggestions(filtered)
            setShowSuggestions(filtered.length > 0)
            setSelectedIndex(-1)
        } else {
            setShowSuggestions(false)
        }
    }, [value])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
                inputRef.current && !inputRef.current.contains(e.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (value.trim()) {
            setShowSuggestions(false)
            onSearch(value.trim())
        }
    }

    const handleSelectSuggestion = (collection: NFTCollection) => {
        setValue(collection.address)
        setShowSuggestions(false)
        onSearch(collection.address)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => Math.max(prev - 1, -1))
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault()
            handleSelectSuggestion(suggestions[selectedIndex])
        } else if (e.key === 'Escape') {
            setShowSuggestions(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <div className="relative flex items-center">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (value.length > 0 && !value.startsWith('0x') && suggestions.length > 0) {
                            setShowSuggestions(true)
                        }
                    }}
                    placeholder="Search by name or paste address (0x...)"
                    className="focus-ring w-full rounded-2xl border border-border-subtle bg-bg-dark/60 py-4 pl-12 pr-36 text-sm text-slate-200 placeholder-slate-500 shadow-soft backdrop-blur-md transition-all hover:bg-bg-dark/80 focus:bg-bg-dark"
                    disabled={loading}
                    autoComplete="off"
                />
                <div className="pointer-events-none absolute left-4 text-slate-500">
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                <div className="absolute right-2 flex items-center gap-2">
                    {value && (
                        <button
                            type="button"
                            onClick={() => { setValue(''); setShowSuggestions(false) }}
                            className="rounded-full p-1.5 text-slate-500 hover:bg-white/10 hover:text-slate-300 transition-colors"
                            disabled={loading}
                            aria-label="Clear"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !value.trim()}
                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-accent px-5 py-2 font-medium text-white shadow-lg transition-all hover:bg-accent/90 hover:shadow-accent/25 disabled:opacity-50 disabled:shadow-none"
                    >
                        <span className="relative flex items-center gap-2">
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    <span>Loading</span>
                                </>
                            ) : (
                                <>
                                    <span>Explore</span>
                                    <svg
                                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {/* Autocomplete Suggestions */}
            {showSuggestions && (
                <div
                    ref={suggestionsRef}
                    className="absolute z-50 mt-2 w-full rounded-xl border border-border-subtle bg-bg-dark/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                >
                    <div className="p-2 text-xs text-slate-500 border-b border-border-subtle">
                        Suggestions
                    </div>
                    <ul className="max-h-64 overflow-y-auto">
                        {suggestions.map((collection, index) => (
                            <li key={collection.address}>
                                <button
                                    type="button"
                                    onClick={() => handleSelectSuggestion(collection)}
                                    className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${index === selectedIndex
                                        ? 'bg-accent/20 text-white'
                                        : 'hover:bg-white/5 text-slate-300'
                                        }`}
                                >
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent/30 to-accent-2/30 flex items-center justify-center text-xs font-bold text-accent">
                                        {collection.symbol.slice(0, 2)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{collection.name}</div>
                                        <div className="text-xs text-slate-500 truncate font-mono">
                                            {collection.address.slice(0, 10)}...{collection.address.slice(-6)}
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                                        {collection.symbol}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </form>
    )
}
