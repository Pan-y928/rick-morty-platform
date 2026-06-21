import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeFavorite } from '../api/favoritesApi'
import type { FavoriteCharacter } from '../types/favorite'
import { favoriteKeys } from './favoriteKeys'

export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeFavorite,
    onMutate: async (characterId) => {
      await queryClient.cancelQueries({ queryKey: favoriteKeys.list() })
      const previous = queryClient.getQueryData<FavoriteCharacter[]>(
        favoriteKeys.list(),
      )

      queryClient.setQueryData<FavoriteCharacter[]>(
        favoriteKeys.list(),
        (current = []) =>
          current.filter((favorite) => favorite.characterId !== characterId),
      )

      return { previous }
    },
    onError: (_error, _characterId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(favoriteKeys.list(), context.previous)
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list() }),
  })
}
