import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/auth'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-sm font-semibold ${
    isActive ? 'bg-lime-300 text-[#071311]' : 'text-slate-300 hover:bg-white/5 hover:text-white'
  }`

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#071311] text-slate-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#071311]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <NavLink to="/characters" className="font-black tracking-[0.22em] text-lime-300">
            RICKVERSE
          </NavLink>
          <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-1">
            <NavLink to="/characters" className={linkClass}>Characters</NavLink>
            <NavLink to="/user/characters" className={linkClass}>Favorites</NavLink>
            <NavLink to="/user/profile" className={linkClass}>Profile</NavLink>
            {user ? (
              <button type="button" onClick={handleLogout} className="ml-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-red-300/50 hover:text-red-200">
                Log out
              </button>
            ) : (
              <NavLink to="/" className="ml-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold hover:border-lime-300/50 hover:text-lime-300">
                Log in
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <Outlet />
      </main>
    </div>
  )
}
