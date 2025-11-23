'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import PageShell from '@/components/layout/PageShell'
import Script from 'next/script'

type TabType = 'swap' | 'buy'

const POPULAR_TOKENS = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: 'bg-orange-500' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: 'bg-indigo-500' },
    { symbol: 'SOL', name: 'Solana', icon: '◎', color: 'bg-purple-500' },
    { symbol: 'USDC', name: 'USD Coin', icon: '$', color: 'bg-blue-500' },
    { symbol: 'XRP', name: 'Ripple', icon: '✕', color: 'bg-slate-500' },
    { symbol: 'MATIC', name: 'Polygon', icon: '⬡', color: 'bg-violet-500' },
]

export default function BuyCryptoPage() {
    const { address, isConnected } = useAccount()
    const [copiedAddress, setCopiedAddress] = useState(false)
    const [activeTab, setActiveTab] = useState<TabType>('swap')

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address)
            setCopiedAddress(true)
            setTimeout(() => setCopiedAddress(false), 2000)
        }
    }

    // Build ChangeNOW widget URL with dark mode
    const getSwapWidgetUrl = () => {
        const params = new URLSearchParams({
            amount: '0.1',
            from: 'btc',
            to: 'eth',
            backgroundColor: '0f172a',
            darkMode: 'true',
            primaryColor: '22c55e',
            logo: 'false',
            FAQ: 'false',
            horizontal: 'false',
            locales: 'true',
            toTheMoon: 'false',
        })
        return `https://changenow.io/embeds/exchange-widget/v2/widget.html?${params.toString()}`
    }

    // Build Guardarian fiat widget URL (works without API key in demo mode)
    const getBuyWidgetUrl = () => {
        const params = new URLSearchParams({
            theme: 'dark',
            type: 'narrow',
            defaultSide: 'buy_crypto',
        })
        // Guardarian allows testing without API key
        return `https://guardarian.com/calculator/v1?${params.toString()}`
    }

    return (
        <PageShell
            title="Buy & Swap Crypto"
            description="Exchange cryptocurrencies or purchase with fiat currency."
        >
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Top Section - Wallet & Popular Tokens */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Wallet Status Card */}
                    <div className="glass-panel rounded-2xl p-5">
                        <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Your Wallet
                        </h3>
                        {isConnected && address ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                                    <span className="text-sm font-medium text-emerald-400">Connected</span>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                                    <p className="text-xs text-slate-400 mb-1">Receiving Address</p>
                                    <div className="flex items-center gap-2">
                                        <code className="text-xs text-slate-200 font-mono break-all flex-1">
                                            {address.slice(0, 10)}...{address.slice(-8)}
                                        </code>
                                        <button
                                            onClick={copyAddress}
                                            className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                                        >
                                            {copiedAddress ? (
                                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Use this address when receiving crypto from the exchange.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400"></div>
                                    <span className="text-sm font-medium text-amber-400">Not Connected</span>
                                </div>
                                <p className="text-sm text-slate-400">
                                    Connect your wallet to copy your receiving address.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Popular Tokens */}
                    <div className="lg:col-span-2 glass-panel rounded-2xl p-5">
                        <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            Popular Tokens
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                            {POPULAR_TOKENS.map((token, idx) => (
                                <motion.div
                                    key={token.symbol}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex flex-col items-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-accent/30 hover:bg-slate-800 transition-all cursor-pointer group"
                                >
                                    <div className={`w-10 h-10 rounded-full ${token.color} flex items-center justify-center text-white font-bold text-lg mb-2 group-hover:scale-110 transition-transform`}>
                                        {token.icon}
                                    </div>
                                    <span className="text-sm font-medium text-slate-200">{token.symbol}</span>
                                    <span className="text-xs text-slate-500">{token.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Exchange Widget Section */}
                <div className="glass-panel rounded-2xl overflow-hidden">
                    {/* Tab Header */}
                    <div className="p-4 border-b border-border-subtle">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('swap')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'swap'
                                        ? 'bg-accent/20 text-accent border border-accent/30'
                                        : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                        Swap Crypto
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('buy')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'buy'
                                        ? 'bg-accent/20 text-accent border border-accent/30'
                                        : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Buy with Fiat
                                    </span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs text-emerald-400 font-medium">LIVE</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 mt-3">
                            {activeTab === 'swap'
                                ? 'Exchange one cryptocurrency for another instantly with ChangeNOW'
                                : 'Purchase cryptocurrency with credit card or bank transfer via Guardarian'
                            }
                        </p>
                    </div>

                    {/* Widget Container */}
                    <div className="p-4 bg-slate-900/30 min-h-[500px] flex items-center justify-center">
                        {activeTab === 'swap' ? (
                            <div className="w-full max-w-md mx-auto">
                                <iframe
                                    id="changenow-widget"
                                    src={getSwapWidgetUrl()}
                                    style={{
                                        height: '356px',
                                        width: '100%',
                                        border: 'none',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                    }}
                                    title="ChangeNOW Exchange Widget"
                                />
                                <Script
                                    src="https://changenow.io/embeds/exchange-widget/v2/stepper-connector.js"
                                    strategy="lazyOnload"
                                />
                            </div>
                        ) : (
                            <div className="w-full max-w-md mx-auto">
                                <iframe
                                    src={getBuyWidgetUrl()}
                                    style={{
                                        height: '625px',
                                        width: '100%',
                                        border: 'none',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                    }}
                                    title="Guardarian Buy Widget"
                                    allow="accelerometer; autoplay; camera; gyroscope; payment"
                                />
                            </div>
                        )}
                    </div>

                    {/* Widget Footer */}
                    <div className="p-3 bg-slate-900/50 border-t border-border-subtle">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>
                                Powered by{' '}
                                <a
                                    href={activeTab === 'swap' ? 'https://changenow.io' : 'https://guardarian.com'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent hover:underline"
                                >
                                    {activeTab === 'swap' ? 'ChangeNOW' : 'Guardarian'}
                                </a>
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Non-custodial & Secure
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-panel rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-200">Instant Swaps</h4>
                                <p className="text-xs text-slate-500 mt-1">Exchange 700+ cryptocurrencies in minutes with no registration required.</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-200">Non-Custodial</h4>
                                <p className="text-xs text-slate-500 mt-1">Your funds go directly to your wallet. We never hold your crypto.</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-200">Best Rates</h4>
                                <p className="text-xs text-slate-500 mt-1">Competitive exchange rates with transparent fees. No hidden charges.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="glass-panel rounded-xl p-4 border-amber-500/10">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h4 className="font-medium text-amber-400">Security Reminder</h4>
                            <p className="text-sm text-slate-400 mt-1">
                                Always double-check wallet addresses before confirming transactions. Start with small amounts for your first transaction. Enable 2FA on all accounts.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageShell>
    )
}
