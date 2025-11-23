'use client'

import { useState } from 'react'
import { useAccount, useDisconnect, useBalance } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion, AnimatePresence } from 'framer-motion'
import { chainInfo } from '@/lib/web3/config'

export default function Topbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false)
  const { address, isConnected, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })

  const chain = chainId ? chainInfo[chainId] : null

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-void-900/80 backdrop-blur-xl px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <svg className="w-6 h-6 text-silver-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page title - hidden on mobile, shows on desktop when sidebar is visible */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="h-8 w-px bg-neon-500/20" />
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-neon-400 animate-pulse shadow-neon-sm" />
          <span className="text-sm text-silver-400">Live Data</span>
        </div>
      </div>

      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center gap-2">
        <div className="relative flex h-8 w-8 items-center justify-center">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-500 to-neon-600" />
          <svg className="relative z-10 w-4 h-4 text-void-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="font-bold text-white">Web3 Hub</span>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Network indicator */}
        {isConnected && chain && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-void-700/50 border border-white/5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: chain.color }}
            />
            <span className="text-xs text-silver-300">{chain.name}</span>
          </div>
        )}

        {/* Wallet connect button - using RainbowKit's ConnectButton with custom rendering */}
        <ConnectButton.Custom>
          {({
            account,
            chain: connectedChain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const ready = mounted
            const connected = ready && account && connectedChain

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        className="btn-primary flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Connect Wallet
                      </button>
                    )
                  }

                  if (connectedChain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        className="btn-primary bg-red-500 hover:bg-red-600"
                      >
                        Wrong network
                      </button>
                    )
                  }

                  return (
                    <div className="relative">
                      <button
                        onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-500/15 to-neon-400/5 border border-neon-500/30 hover:border-neon-500/60 hover:shadow-neon-sm transition-all duration-200"
                      >
                        <div className="h-2 w-2 rounded-full bg-neon-400 shadow-neon-sm" />
                        <span className="text-sm font-medium text-white">
                          {account.displayName}
                        </span>
                        {account.displayBalance && (
                          <span className="hidden sm:inline text-xs text-silver-400">
                            {account.displayBalance}
                          </span>
                        )}
                        <svg className="w-4 h-4 text-silver-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Wallet Dropdown menu */}
                      <AnimatePresence>
                        {isWalletMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-56 rounded-xl glass-intense border border-white/10 p-2 shadow-xl z-50"
                          >
                            <div className="px-3 py-2 border-b border-white/5 mb-2">
                              <p className="text-xs text-silver-500">Connected Wallet</p>
                              <p className="text-sm text-white font-mono">{account.displayName}</p>
                            </div>
                            <button
                              onClick={() => {
                                openChainModal()
                                setIsWalletMenuOpen(false)
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-silver-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                              </svg>
                              Switch Network
                            </button>
                            <a
                              href="/wallet"
                              onClick={() => setIsWalletMenuOpen(false)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-silver-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              View Wallet
                            </a>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(account.address)
                                setIsWalletMenuOpen(false)
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-silver-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy Address
                            </button>
                            <a
                              href={`https://etherscan.io/address/${account.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsWalletMenuOpen(false)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-silver-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              View on Etherscan
                            </a>
                            <div className="border-t border-white/5 mt-2 pt-2">
                              <button
                                onClick={() => {
                                  disconnect()
                                  setIsWalletMenuOpen(false)
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Disconnect
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })()}
              </div>
            )
          }}
        </ConnectButton.Custom>
      </div>

      {/* Mobile navigation overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-void-800 border-r border-neon-500/10 z-50 lg:hidden"
            >
              {/* Mobile nav content */}
              <div className="flex h-16 items-center gap-3 border-b border-neon-500/10 px-6">
                <div className="relative flex h-9 w-9 items-center justify-center">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-500 to-neon-600" />
                  <svg className="relative z-10 w-5 h-5 text-void-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-bold text-white">Web3 Hub</h1>
                </div>
              </div>
              <div className="p-4 space-y-1">
                {[
                  { name: 'Dashboard', href: '/dashboard' },
                  { name: 'Tokens', href: '/tokens' },
                  { name: 'Wallet', href: '/wallet' },
                  { name: 'NFTs', href: '/nfts' },
                  { name: 'AI Assistant', href: '/ai-assistant' },
                  { name: 'Trending', href: '/automation' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-silver-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
