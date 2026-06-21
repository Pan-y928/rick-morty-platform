import { useQuery } from '@tanstack/react-query'
import { getFavorites } from '../api/favoritesApi'
import { favoriteKeys } from './favoriteKeys'

export function useFavorites(enabled = true) {
  return useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: getFavorites,
    enabled,
    staleTime: 30_000,
  })
}
