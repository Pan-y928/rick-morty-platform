import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addFavorite } from '../api/favoritesApi'
import type { FavoriteCharacter } from '../types/favorite'
import { favoriteKeys } from './favoriteKeys'

export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addFavorite,
    onMutate: async (characterId) => {
      await queryClient.cancelQueries({ queryKey: favoriteKeys.list() })
      const previous = queryClient.getQueryData<FavoriteCharacter[]>(
        favoriteKeys.list(),
      )

      queryClient.setQueryData<FavoriteCharacter[]>(
        favoriteKeys.list(),
        (current = []) =>
          current.some((favorite) => favorite.characterId === characterId)
            ? current
            : [
                { characterId, createdAtUtc: new Date().toISOString() },
                ...current,
              ],
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
