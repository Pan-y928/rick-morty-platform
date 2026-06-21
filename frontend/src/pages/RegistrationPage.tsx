import { Link } from 'react-router-dom'

export function RegistrationPage() {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">New traveller</p>
      <h1 className="mt-3 text-4xl font-black text-white">Create an account</h1>
      <p className="mt-3 text-slate-400">Registration wiring arrives with the authentication API.</p>
      <form className="mt-8 grid gap-4">
        {['Name', 'Username', 'Email', 'Password'].map((label) => (
          <label key={label} className="block text-sm font-semibold text-slate-200">
            {label}
            <input type={label === 'Password' ? 'password' : label === 'Email' ? 'email' : 'text'} required className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300" />
          </label>
        ))}
        <button type="button" className="mt-2 rounded-xl bg-lime-300 px-5 py-3.5 font-black text-[#071311] hover:bg-lime-200">
          Create account
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Already registered? <Link to="/" className="font-bold text-cyan-300">Log in</Link>
      </p>
    </div>
  )
}
