import { useQuery } from '@tanstack/react-query'
import { getCharactersByIds } from '../api/charactersApi'

export function useCharactersByIds(ids: number[]) {
  return useQuery({
    queryKey: ['characters', 'by-ids', ids],
    queryFn: () => getCharactersByIds(ids),
  })
}
