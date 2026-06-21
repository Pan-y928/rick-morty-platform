import { useQuery } from '@tanstack/react-query'
import { tokenStorage } from '../../../lib/tokenStorage'
import { getCurrentUser } from '../api/authApi'
import { authKeys } from './authKeys'

export function useCurrentUser() {
  const hasToken = Boolean(tokenStorage.get())
  const query = useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUser,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60_000,
  })

  return {
    ...query,
    user: query.data ?? null,
    isAuthenticated: hasToken && Boolean(query.data),
    isInitializing: hasToken && query.isPending,
  }
}
