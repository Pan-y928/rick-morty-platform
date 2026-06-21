import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { getApiErrorMessage } from '../features/auth/api/getApiErrorMessage'
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser'
import { useLogin } from '../features/auth/hooks/useLogin'

const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required.'),
  password: z.string().min(1, 'Password is required.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const { user, isInitializing } = useCurrentUser()
  const loginMutation = useLogin()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const from = (location.state as {
    from?: { pathname?: string; search?: string; hash?: string }
  } | null)?.from
  const destination = from
    ? `${from.pathname ?? ''}${from.search ?? ''}${from.hash ?? ''}`
    : '/characters'

  const onSubmit = handleSubmit(async (values) => {
    loginMutation.reset()
    try {
      await loginMutation.mutateAsync(values)
      navigate(destination, { replace: true })
    } catch {
      // The mutation exposes the API error below the page heading.
    }
  })

  if (!isInitializing && user) {
    return <Navigate to="/characters" replace />
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300 sm:text-sm">Welcome back</p>
      <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Enter the portal</h1>
      <p className="mt-3 text-slate-400">Sign in to open character files and manage favorites.</p>

      {loginMutation.error ? (
        <div role="alert" className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {getApiErrorMessage(loginMutation.error)}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-7 space-y-4 sm:mt-9 sm:space-y-5" noValidate>
        <label className="block text-sm font-semibold text-slate-200">
          Username
          <input
            {...register('username')}
            autoComplete="username"
            placeholder="morty"
            aria-invalid={Boolean(errors.username)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-cyan-300"
          />
          {errors.username ? <span className="mt-2 block text-xs text-red-300">{errors.username.message}</span> : null}
        </label>
        <label className="block text-sm font-semibold text-slate-200">
          Password
          <input
            {...register('password')}
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={Boolean(errors.password)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-cyan-300"
          />
          {errors.password ? <span className="mt-2 block text-xs text-red-300">{errors.password.message}</span> : null}
        </label>
        <button
          type="submit"
          disabled={isSubmitting || loginMutation.isPending || isInitializing}
          className="w-full rounded-xl bg-lime-300 px-5 py-3.5 font-black text-[#071311] hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loginMutation.isPending ? 'Opening portal…' : 'Log in'}
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
