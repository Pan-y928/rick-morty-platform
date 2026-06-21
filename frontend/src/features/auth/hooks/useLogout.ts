import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { tokenStorage } from '../../../lib/tokenStorage'

export function useLogout() {
  const queryClient = useQueryClient()

  return useCallback(() => {
    tokenStorage.clear()
    queryClient.clear()
  }, [queryClient])
}
