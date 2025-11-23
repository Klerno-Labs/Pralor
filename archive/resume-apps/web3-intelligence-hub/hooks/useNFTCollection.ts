import { useState, useCallback } from 'react'
import { retryFetch, isRetryableError } from '@/lib/retry'
import { calculateRarityScores } from '@/lib/rarity'
import type { CollectionMetadata, CollectionResponse, NftItem } from '@/types/nft'

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/

const mergeUniqueNfts = (current: NftItem[], incoming: NftItem[]): NftItem[] => {
    const seen = new Set<string>()
    return [...current, ...incoming].filter((nft) => {
        const key = nft.tokenId
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })
}

export function useNFTCollection() {
    const [address, setAddress] = useState<string>('')
    const [metadata, setMetadata] = useState<CollectionMetadata | null>(null)
    const [nfts, setNfts] = useState<NftItem[]>([])
    const [pageKey, setPageKey] = useState<string | null>(null)
    const [totalCount, setTotalCount] = useState<number | null>(null)
    const [loadingInitial, setLoadingInitial] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [retryCount, setRetryCount] = useState<number>(0)
    const [canRetry, setCanRetry] = useState<boolean>(false)

    const loadCollection = useCallback(
        async (addr: string) => {
            if (loadingInitial || loadingMore) return

            const normalized = addr.trim()
            if (!ADDRESS_REGEX.test(normalized)) {
                setError('Enter a valid contract address (0x...)')
                return
            }

            try {
                setLoadingInitial(true)
                setError(null)
                setCanRetry(false)
                setRetryCount(0)
                setAddress(normalized)
                setMetadata(null)
                setNfts([])
                setPageKey(null)
                setTotalCount(null)

                const data = await retryFetch(
                    async () => {
                        const res = await fetch('/api/collection', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ address: normalized }),
                            cache: 'no-store',
                        })

                        if (!res.ok) {
                            const json = await res.json().catch(() => ({}))
                            throw new Error((json as { error?: string }).error || 'Failed to load collection')
                        }

                        return (await res.json()) as CollectionResponse
                    },
                    {
                        maxRetries: 3,
                        delayMs: 1000,
                        backoff: true,
                        onRetry: (err, attempt) => {
                            console.warn(`Retry attempt ${attempt}: ${err.message}`)
                            setRetryCount(attempt)
                        },
                    }
                )

                setMetadata(data.metadata)
                setNfts(calculateRarityScores(data.nfts))
                setPageKey(data.pageKey ?? null)
                setTotalCount(data.totalCount ?? data.metadata.totalSupply ?? null)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Something went wrong'
                setError(message)
                setCanRetry(err instanceof Error && isRetryableError(err))
            } finally {
                setLoadingInitial(false)
            }
        },
        [loadingInitial, loadingMore]
    )

    const loadMore = useCallback(async () => {
        if (!address || !pageKey || loadingMore || loadingInitial) return
        try {
            setLoadingMore(true)
            setError(null)
            setCanRetry(false)

            const data = await retryFetch(
                async () => {
                    const res = await fetch('/api/collection/page', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ address, pageKey }),
                        cache: 'no-store',
                    })

                    if (!res.ok) {
                        const json = await res.json().catch(() => ({}))
                        throw new Error((json as { error?: string }).error || 'Failed to load next page')
                    }

                    return (await res.json()) as CollectionResponse
                },
                {
                    maxRetries: 3,
                    delayMs: 1000,
                    backoff: true,
                }
            )

            setNfts((prev) => calculateRarityScores(mergeUniqueNfts(prev, data.nfts)))
            setPageKey(data.pageKey ?? null)
            setTotalCount((prev) => data.totalCount ?? prev ?? data.metadata.totalSupply ?? null)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Something went wrong'
            setError(message)
            setCanRetry(err instanceof Error && isRetryableError(err))
        } finally {
            setLoadingMore(false)
        }
    }, [address, pageKey, loadingMore, loadingInitial])

    const clearCollection = () => {
        setAddress('')
        setMetadata(null)
        setNfts([])
        setPageKey(null)
        setTotalCount(null)
        setError(null)
        setRetryCount(0)
        setCanRetry(false)
    }

    return {
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
    }
}
