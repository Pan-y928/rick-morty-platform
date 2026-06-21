import { apiClient } from '../../../lib/apiClient'
import type { FavoriteCharacter } from '../types/favorite'

export async function getFavorites() {
  const { data } = await apiClient.get<FavoriteCharacter[]>('/users/me/favorites')
  return data
}

export async function addFavorite(characterId: number) {
  const { data } = await apiClient.post<FavoriteCharacter>(
    `/users/me/favorites/${characterId}`,
  )
  return data
}

export async function removeFavorite(characterId: number) {
  await apiClient.delete(`/users/me/favorites/${characterId}`)
}
