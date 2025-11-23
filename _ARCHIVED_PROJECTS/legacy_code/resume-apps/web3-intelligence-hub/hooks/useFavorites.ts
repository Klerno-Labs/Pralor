import { useState, useEffect, useCallback } from 'react'

const FAVORITES_KEY = 'nft-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loaded, setLoaded] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as string[]
        setFavorites(new Set(parsed))
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
    } finally {
      setLoaded(true)
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)))
    } catch (error) {
      console.error('Failed to save favorites:', error)
    }
  }, [favorites, loaded])

  const toggleFavorite = useCallback((tokenId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(tokenId)) {
        next.delete(tokenId)
      } else {
        next.add(tokenId)
      }
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (tokenId: string) => {
      return favorites.has(tokenId)
    },
    [favorites]
  )

  const clearFavorites = useCallback(() => {
    setFavorites(new Set())
  }, [])

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    loaded,
  }
}
