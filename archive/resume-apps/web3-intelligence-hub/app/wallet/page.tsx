'use client'

import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import PageShell from '@/components/layout/PageShell'
import Card, { StatCard } from '@/components/ui/Card'
import BalanceCard from '@/components/wallet/BalanceCard'
import TokenList from '@/components/wallet/TokenList'
import NftGrid from '@/components/wallet/NftGrid'
import { chainInfo } from '@/lib/web3/config'

export default function WalletPage() {
  const { address, isConnected, chainId } = useAccount()
  const chain = chainId ? chainInfo[chainId] : null

  if (!isConnected) {
    return (
      <PageShell title="Wallet" description="Connect your wallet to view your portfolio">
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-500/20 to-neon-400/5 border border-neon-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-neon-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-silver-400 mb-6">
              Connect your Web3 wallet to view your token balances, NFTs, and transaction history.
            </p>
            <p className="text-sm text-silver-500">
              Use the Connect Wallet button in the top navigation bar to get started.
            </p>
          </div>
        </Card>
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Wallet"
      description="Your connected wallet overview"
      actions={
        chain && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-void-700/50 border border-white/5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: chain.color }} />
            <span className="text-sm text-silver-300">{chain.name}</span>
          </div>
        )
      }
    >
      {/* Wallet Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-intense p-6 mb-6 border border-neon-500/10"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="stat-label mb-1">Connected Address</p>
            <div className="flex items-center gap-3">
              <p className="text-lg md:text-xl font-mono text-white">
                {address?.slice(0, 10)}...{address?.slice(-8)}
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(address!)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-silver-400 hover:text-white"
                title="Copy address"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <a
                href={`https://etherscan.io/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-silver-400 hover:text-white"
                title="View on Etherscan"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-neon-400 animate-pulse shadow-neon-sm" />
            <span className="text-neon-400 text-sm font-medium">Connected</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            label="Network"
            value={chain?.name || 'Unknown'}
            hint={chainId ? `Chain ID: ${chainId}` : ''}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            }
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <StatCard
            label="Tokens Tracked"
            value="4"
            hint="USDC, USDT, WETH, DAI"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            label="NFTs"
            value="View Collection"
            hint="Browse your NFTs"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
        </motion.div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <BalanceCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TokenList />
        </motion.div>
      </div>

      {/* NFT Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <NftGrid />
      </motion.div>
    </PageShell>
  )
}
