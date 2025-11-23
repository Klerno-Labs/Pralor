import { useState, useMemo } from 'react'
import type { NftItem } from '@/types/nft'

export type TraitFilterState = {
    [traitType: string]: Set<string>
}

type SortOption = 'rarity' | 'tokenId' | 'name'

export function useNFTFilters(nfts: NftItem[], isFavorite: (id: string) => boolean) {
    const [filters, setFilters] = useState<TraitFilterState>({})
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [sortBy, setSortBy] = useState<SortOption>('tokenId')
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

    const toggleFilter = (traitType: string, value: string) => {
        setFilters((prev) => {
            const next: TraitFilterState = { ...prev }
            const currentSet = next[traitType] ? new Set(next[traitType]) : new Set<string>()
            if (currentSet.has(value)) currentSet.delete(value)
            else currentSet.add(value)
            if (currentSet.size === 0) delete next[traitType]
            else next[traitType] = currentSet
            return next
        })
    }

    const clearFilters = () => setFilters({})

    const activeFiltersCount = useMemo(
        () => Object.values(filters).reduce((total, set) => total + set.size, 0),
        [filters]
    )

    const filteredNfts = useMemo(() => {
        let result = [...nfts]

        if (showFavoritesOnly) {
            result = result.filter((nft) => isFavorite(nft.tokenId))
        }

        const activeTypes = Object.keys(filters)
        if (activeTypes.length > 0) {
            result = result.filter((nft) =>
                activeTypes.every((type) => {
                    const activeValues = filters[type]
                    if (!activeValues || activeValues.size === 0) return true
                    const values = nft.traits
                        .filter((t) => t.type === type)
                        .map((t) => String(t.value ?? 'Unknown'))
                    return values.some((v) => activeValues.has(v))
                })
            )
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim()
            result = result.filter(
                (nft) =>
                    nft.name?.toLowerCase().includes(query) ||
                    nft.tokenIdDecimal.includes(query) ||
                    nft.tokenId.toLowerCase().includes(query)
            )
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case 'rarity':
                    return (a.rarityRank || Infinity) - (b.rarityRank || Infinity)
                case 'name': {
                    const nameA = a.name || a.tokenIdDecimal
                    const nameB = b.name || b.tokenIdDecimal
                    return nameA.localeCompare(nameB)
                }
                case 'tokenId':
                default:
                    return Number(a.tokenIdDecimal) - Number(b.tokenIdDecimal)
            }
        })

        return result
    }, [nfts, filters, searchQuery, sortBy, showFavoritesOnly, isFavorite])

    return {
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
        setFilters, // Exported in case we need direct access
    }
}
