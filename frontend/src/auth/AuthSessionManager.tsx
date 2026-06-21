import { useEffect, type PropsWithChildren } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AUTH_UNAUTHORIZED_EVENT } from '../lib/tokenStorage'

export function AuthSessionManager({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()

  useEffect(() => {
    localStorage.removeItem('demo-authenticated')

    const handleUnauthorized = () => {
      queryClient.clear()
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () =>
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [queryClient])

  return children
}
