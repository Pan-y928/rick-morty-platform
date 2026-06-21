import axios from 'axios'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getCharacters } from '../api/charactersApi'
import type { CharacterFilters } from '../types/character'

export function useCharacters(filters: CharacterFilters) {
  return useQuery({
    queryKey: ['characters', filters],
    queryFn: ({ signal }) => getCharacters(filters, signal),
    placeholderData: keepPreviousData,
    retry: (failureCount, error) => {
      if (axios.isCancel(error)) return false
      if (!axios.isAxiosError(error)) return failureCount < 2

      const status = error.response?.status
      const isTemporaryFailure =
        status === undefined || status === 408 || status === 429 || status >= 500

      return isTemporaryFailure && failureCount < 1
    },
    retryDelay: 300,
  })
}
