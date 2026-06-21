import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser'

export function ProtectedRoute() {
  const { user, isInitializing } = useCurrentUser()
  const location = useLocation()

  if (isInitializing) {
    return (
      <div className="grid min-h-[50vh] place-items-center" aria-label="Restoring session">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-lime-300" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return <Outlet />
}
