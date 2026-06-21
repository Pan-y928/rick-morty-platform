import { type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/auth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/characters'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    login()
    navigate(destination, { replace: true })
  }

  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">Welcome back</p>
      <h1 className="mt-3 text-4xl font-black text-white">Enter the portal</h1>
      <p className="mt-3 text-slate-400">Use any values for this routing demo.</p>
      <form onSubmit={handleSubmit} className="mt-9 space-y-5">
        <label className="block text-sm font-semibold text-slate-200">
          Username
          <input required name="username" autoComplete="username" placeholder="morty" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-cyan-300" />
        </label>
        <label className="block text-sm font-semibold text-slate-200">
          Password
          <input required type="password" name="password" autoComplete="current-password" placeholder="••••••••" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-cyan-300" />
        </label>
        <button type="submit" className="w-full rounded-xl bg-lime-300 px-5 py-3.5 font-black text-[#071311] hover:bg-lime-200">
          Log in
        </button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-400">
        New to this dimension?{' '}
        <Link to="/registration" className="font-bold text-cyan-300 hover:text-cyan-200">Create an account</Link>
      </p>
      <Link to="/characters" className="mt-4 block text-center text-sm font-semibold text-slate-500 hover:text-white">
        Browse public characters instead
      </Link>
    </div>
  )
}
