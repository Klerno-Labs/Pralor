'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion'
import PageShell from '@/components/layout/PageShell'
import CollectionStats from '@/components/nfts/CollectionStats'
import EmptyState from '@/components/nfts/EmptyState'
import TopCollections from '@/components/nfts/TopCollections'
import FiltersPanel from '@/components/nfts/FiltersPanel'
import VirtualizedNFTGrid from '@/components/nfts/VirtualizedNFTGrid'
import SearchBar from '@/components/nfts/SearchBar'
import { GridSkeleton, StatSkeleton } from '@/components/nfts/LoadingSkeleton'
import { exportToCSV, exportToJSON } from '@/lib/export'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useFavorites } from '@/hooks/useFavorites'
import { useNFTCollection } from '@/hooks/useNFTCollection'
import { useNFTFilters } from '@/hooks/useNFTFilters'
import type { NftItem } from '@/types/nft'

const NFTDetailModal = dynamic(() => import('@/components/nfts/NFTDetailModal'), {
  loading: () => null,
  ssr: false,
})

export default function NFTsPage() {
  const [selectedNft, setSelectedNft] = useState<NftItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { isFavorite, toggleFavorite, favorites } = useFavorites()

  const {
    address,
    metadata,
    nfts,
    loadingInitial,
    loadingMore,
    error,
    retryCount,
    canRetry,
    totalCount,
    pageKey,
    loadCollection,
    loadMore,
    setError,
    clearCollection,
  } = useNFTCollection()

  const {
    filters,
    searchQuery,
    sortBy,
    showFavoritesOnly,
    filteredNfts,
    activeFiltersCount,
    setSearchQuery,
    setSortBy,
    setShowFavoritesOnly,
    toggleFilter,
    clearFilters,
  } = useNFTFilters(nfts, isFavorite)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sentinelRef = useInfiniteScroll({
    hasMore: Boolean(pageKey),
    isLoading: loadingMore,
    onLoadMore: loadMore,
    threshold: 500,
  })

  const totalKnown = totalCount ?? metadata?.totalSupply ?? null
  const summary = totalKnown
    ? `Showing ${filteredNfts.length.toLocaleString()} of ${totalKnown.toLocaleString()} NFTs`
    : `Showing ${filteredNfts.length.toLocaleString()} NFT${filteredNfts.length === 1 ? '' : 's'} loaded`

  const emptyMessage =
    nfts.length === 0 ? 'No NFTs loaded for this collection yet.' : 'No NFTs match the active filters.'

  const showInitialSkeleton = loadingInitial && !metadata

  return (
    <PageShell
      title="NFT Explorer"
      description="Alchemy-powered dashboard for exploring collections, traits, and rarity."
      centerWidth="max-w-xl"
      topLeftActions={
        metadata && (
          <button
            type="button"
            onClick={() => clearCollection()}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )
      }
    >
      <LazyMotion features={domAnimation}>
        <div className="relative flex flex-col items-center overflow-x-hidden pb-12">

          {/* Search Section */}
          <div className="w-full max-w-xl relative z-20 mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-accent-2 rounded-2xl blur opacity-20 transition duration-500 group-hover:opacity-40" />
            <div className="relative flex items-center gap-4">
              {/* Back button moved into the page header via PageShell.leftActions */}

              <div className="flex-1">
                <SearchBar onSearch={loadCollection} loading={loadingInitial || loadingMore} />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 w-full max-w-3xl overflow-hidden"
              >
                <div className="flex w-full items-start justify-between gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-left text-sm text-red-100 backdrop-blur-md">
                  <div className="flex-1">
                    <p className="font-medium">{error}</p>
                    {retryCount > 0 && (
                      <p className="mt-1 text-xs text-red-200/70">Retried {retryCount} time{retryCount === 1 ? '' : 's'}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {canRetry && address && (
                      <button
                        type="button"
                        className="focus-ring rounded-full bg-red-500/20 px-4 py-1.5 text-xs font-medium text-red-100 hover:bg-red-500/30 transition-colors"
                        onClick={() => loadCollection(address)}
                      >
                        Retry
                      </button>
                    )}
                    <button
                      type="button"
                      className="focus-ring rounded-full px-3 py-1.5 text-xs font-medium text-red-100 hover:bg-red-500/20 transition-colors"
                      onClick={() => setError(null)}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* Show TopCollections and EmptyState when no collection is loaded */}
          {!metadata && !showInitialSkeleton && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <EmptyState />
              </motion.div>
              <div className="mt-8 w-full max-w-3xl">
                <TopCollections onSelectCollection={loadCollection} />
              </div>
            </>
          )}

          {showInitialSkeleton && (
            <div className="w-full max-w-7xl animate-pulse space-y-8">
              <StatSkeleton />
              <GridSkeleton />
            </div>
          )}

          {metadata && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-7xl flex flex-col items-center"
            >
              <CollectionStats metadata={metadata} />

              <section className="mt-12 flex w-full flex-col gap-8 lg:flex-row">
                <aside className="lg:w-72 lg:flex-shrink-0">
                  <div className="sticky top-8">
                    <FiltersPanel nfts={nfts} filters={filters} onToggle={toggleFilter} onClear={clearFilters} />
                  </div>
                </aside>

                <div className="flex-1 min-w-0">
                  <div className="mb-6 flex flex-col gap-4 glass-card rounded-2xl p-4">
                    <div className="flex flex-wrap gap-3">
                      <input
                        type="text"
                        placeholder="Search by name or token ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="focus-ring flex-1 min-w-[200px] rounded-xl border border-border-subtle bg-bg-dark/50 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 transition-colors focus:bg-bg-dark"
                      />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'rarity' | 'tokenId' | 'name')}
                        className="focus-ring rounded-xl border border-border-subtle bg-bg-dark/50 px-4 py-2.5 text-sm text-slate-200 transition-colors focus:bg-bg-dark cursor-pointer"
                      >
                        <option value="tokenId">Sort by Token ID</option>
                        <option value="rarity">Sort by Rarity</option>
                        <option value="name">Sort by Name</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        className={`focus-ring rounded-xl border border-border-subtle px-4 py-2.5 text-sm font-medium transition-all ${showFavoritesOnly
                          ? 'bg-accent/20 text-accent border-accent/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                          : 'bg-bg-dark/50 text-slate-300 hover:bg-bg-dark hover:text-white'
                          }`}
                      >
                        ★ {showFavoritesOnly ? `Favorites (${favorites.size})` : 'Favorites'}
                      </button>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => exportToJSON(filteredNfts, metadata)}
                          className="focus-ring rounded-xl border border-border-subtle bg-bg-dark/50 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-bg-dark hover:text-white"
                        >
                          JSON
                        </button>
                        <button
                          type="button"
                          onClick={() => exportToCSV(filteredNfts, metadata)}
                          className="focus-ring rounded-xl border border-border-subtle bg-bg-dark/50 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-bg-dark hover:text-white"
                        >
                          CSV
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 px-1">
                      <span className="text-sm text-slate-400 font-medium">{summary}</span>
                      {activeFiltersCount > 0 && (
                        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent border border-accent/20">
                          {activeFiltersCount} filter{activeFiltersCount === 1 ? '' : 's'} active
                        </span>
                      )}
                    </div>
                  </div>

                  {showInitialSkeleton ? (
                    <GridSkeleton />
                  ) : (
                    <VirtualizedNFTGrid
                      nfts={filteredNfts}
                      allNfts={nfts}
                      emptyMessage={emptyMessage}
                      onNftClick={(nft) => {
                        setSelectedNft(nft)
                        setIsModalOpen(true)
                      }}
                        onBack={clearCollection}
                      isFavorite={isFavorite}
                      onToggleFavorite={toggleFavorite}
                    />
                  )}

                  <div ref={sentinelRef} className="h-8" />

                  {loadingMore && (
                    <div className="mt-8 flex justify-center">
                      <div className="inline-flex items-center gap-3 rounded-full border border-accent/20 bg-accent/5 px-6 py-3 text-sm font-medium text-accent shadow-glow">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                        </span>
                        Loading more NFTs...
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {selectedNft && (
            <NFTDetailModal
              nft={selectedNft}
              allNfts={nfts}
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false)
                setSelectedNft(null)
              }}
            />
          )}
        </div>
      </LazyMotion>
    </PageShell>
  )
}
