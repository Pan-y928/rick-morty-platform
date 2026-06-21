import { useQuery } from '@tanstack/react-query'
import { getCharacter } from '../api/charactersApi'

export function useCharacter(id: number | null) {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => getCharacter(id!),
    enabled: id !== null,
  })
}
