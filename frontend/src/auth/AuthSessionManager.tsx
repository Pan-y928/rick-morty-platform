import { useEffect, type PropsWithChildren } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authKeys } from '../features/auth/hooks/authKeys'
import { AUTH_UNAUTHORIZED_EVENT } from '../lib/tokenStorage'

export function AuthSessionManager({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()

  useEffect(() => {
    localStorage.removeItem('demo-authenticated')

    const handleUnauthorized = () => {
      queryClient.removeQueries({ queryKey: authKeys.all })
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () =>
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [queryClient])

  return children
}
