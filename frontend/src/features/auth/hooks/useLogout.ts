import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { tokenStorage } from '../../../lib/tokenStorage'
import { authKeys } from './authKeys'

export function useLogout() {
  const queryClient = useQueryClient()

  return useCallback(() => {
    tokenStorage.clear()
    queryClient.removeQueries({ queryKey: authKeys.all })
  }, [queryClient])
}
