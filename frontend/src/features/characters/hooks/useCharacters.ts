import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getCharacters } from '../api/charactersApi'
import type { CharacterFilters } from '../types/character'

export function useCharacters(filters: CharacterFilters) {
  return useQuery({
    queryKey: ['characters', filters],
    queryFn: () => getCharacters(filters),
    placeholderData: keepPreviousData,
  })
}
