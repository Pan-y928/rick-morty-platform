import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { getApiErrorMessage } from '../features/auth/api/getApiErrorMessage'
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser'
import { useRegister } from '../features/auth/hooks/useRegister'

const registrationSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(100),
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters.')
      .max(30)
      .regex(/^[a-zA-Z0-9._-]+$/, 'Use letters, numbers, dots, underscores, or hyphens.'),
    email: z.email('Enter a valid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[a-z]/, 'Password must include a lowercase letter.')
      .regex(/[A-Z]/, 'Password must include an uppercase letter.')
      .regex(/[0-9]/, 'Password must include a number.'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

type RegistrationFormValues = z.infer<typeof registrationSchema>

const fieldClass =
  'mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-cyan-300'

export function RegistrationPage() {
  const { user, isInitializing } = useCurrentUser()
  const registerMutation = useRegister()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    registerMutation.reset()
    try {
      await registerMutation.mutateAsync({
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
      })
      navigate('/characters', { replace: true })
    } catch {
      // The mutation exposes the API error below the page heading.
    }
  })

  if (!isInitializing && user) {
    return <Navigate to="/characters" replace />
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300 sm:text-sm">New traveller</p>
      <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Create an account</h1>
      <p className="mt-3 text-slate-400">Register to save characters across dimensions.</p>

      {registerMutation.error ? (
        <div role="alert" className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {getApiErrorMessage(registerMutation.error)}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:mt-8 sm:gap-4" noValidate>
        <label className="block text-sm font-semibold text-slate-200">
          Name
          <input {...register('name')} autoComplete="name" aria-invalid={Boolean(errors.name)} className={fieldClass} />
          {errors.name ? <span className="mt-2 block text-xs text-red-300">{errors.name.message}</span> : null}
        </label>
        <label className="block text-sm font-semibold text-slate-200">
          Username
          <input {...register('username')} autoComplete="username" aria-invalid={Boolean(errors.username)} className={fieldClass} />
          {errors.username ? <span className="mt-2 block text-xs text-red-300">{errors.username.message}</span> : null}
        </label>
        <label className="block text-sm font-semibold text-slate-200">
          Email
          <input {...register('email')} type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className={fieldClass} />
          {errors.email ? <span className="mt-2 block text-xs text-red-300">{errors.email.message}</span> : null}
        </label>
        <label className="block text-sm font-semibold text-slate-200">
          Password
          <input {...register('password')} type="password" autoComplete="new-password" aria-invalid={Boolean(errors.password)} className={fieldClass} />
          {errors.password ? <span className="mt-2 block text-xs text-red-300">{errors.password.message}</span> : null}
        </label>
        <label className="block text-sm font-semibold text-slate-200">
          Confirm password
          <input {...register('confirmPassword')} type="password" autoComplete="new-password" aria-invalid={Boolean(errors.confirmPassword)} className={fieldClass} />
          {errors.confirmPassword ? <span className="mt-2 block text-xs text-red-300">{errors.confirmPassword.message}</span> : null}
        </label>
        <button
          type="submit"
          disabled={isSubmitting || registerMutation.isPending || isInitializing}
          className="mt-2 rounded-xl bg-lime-300 px-5 py-3.5 font-black text-[#071311] hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {registerMutation.isPending ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Already registered? <Link to="/" className="font-bold text-cyan-300">Log in</Link>
      </p>
    </div>
  )
}
