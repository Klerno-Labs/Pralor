import { useEffect, useRef } from 'react'

type UseInfiniteScrollOptions = {
    hasMore: boolean
    isLoading: boolean
    onLoadMore: () => void
    threshold?: number
}

export function useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore,
    threshold = 300,
}: UseInfiniteScrollOptions) {
    const observerRef = useRef<IntersectionObserver | null>(null)
    const sentinelRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!hasMore || isLoading) return

        const options = {
            root: null,
            rootMargin: `${threshold}px`,
            threshold: 0,
        }

        observerRef.current = new IntersectionObserver((entries) => {
            const [entry] = entries
            if (entry.isIntersecting && hasMore && !isLoading) {
                onLoadMore()
            }
        }, options)

        const currentSentinel = sentinelRef.current
        if (currentSentinel) {
            observerRef.current.observe(currentSentinel)
        }

        return () => {
            if (observerRef.current && currentSentinel) {
                observerRef.current.unobserve(currentSentinel)
            }
        }
    }, [hasMore, isLoading, onLoadMore, threshold])

    return sentinelRef
}
