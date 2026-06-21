import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser'
import { useLogout } from '../features/auth/hooks/useLogout'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-1 py-2 text-center text-[11px] font-semibold sm:px-4 sm:text-sm ${
    isActive ? 'bg-lime-300 text-[#071311]' : 'text-slate-300 hover:bg-white/5 hover:text-white'
  }`

export function AppLayout() {
  const { user } = useCurrentUser()
  const logout = useLogout()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="portal-shell min-h-screen bg-[#071311]/75 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-lime-300/15 bg-[#071311]/85 shadow-[0_8px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 sm:py-4">
          <NavLink to="/characters" className="brand-font self-center text-sm tracking-[0.08em] text-lime-300 drop-shadow-[0_0_12px_rgba(168,255,53,0.45)] sm:self-auto sm:text-base">
            RICKVERSE
          </NavLink>
          <nav aria-label="Main navigation" className="grid w-full grid-cols-4 items-center gap-1 sm:flex sm:w-auto">
            <NavLink to="/characters" className={linkClass}>Characters</NavLink>
            <NavLink to="/user/characters" className={linkClass}>Favorites</NavLink>
            <NavLink to="/user/profile" className={linkClass}>Profile</NavLink>
            {user ? (
              <button type="button" onClick={handleLogout} className="rounded-full border border-white/15 px-1 py-2 text-[11px] font-semibold text-slate-300 hover:border-red-300/50 hover:text-red-200 sm:ml-2 sm:px-4 sm:text-sm">
                Log out
              </button>
            ) : (
              <NavLink to="/" className="rounded-full border border-white/15 px-1 py-2 text-center text-[11px] font-semibold hover:border-lime-300/50 hover:text-lime-300 sm:ml-2 sm:px-4 sm:text-sm">
                Log in
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-10">
        <Outlet />
      </main>
    </div>
  )
}
