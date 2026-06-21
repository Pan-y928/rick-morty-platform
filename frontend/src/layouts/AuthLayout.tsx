import { Link, Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <main className="portal-shell relative grid min-h-screen overflow-hidden bg-[#071311]/70 lg:grid-cols-2">
      <div className="pointer-events-none absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />
      <section className="relative hidden border-r border-white/10 p-12 lg:flex lg:flex-col lg:justify-between">
        <Link to="/characters" className="brand-font text-lg tracking-[0.08em] text-lime-300 drop-shadow-[0_0_12px_rgba(168,255,53,0.45)]">
          RICKVERSE
        </Link>
        <div className="max-w-xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
            Interdimensional character archive
          </p>
          <h1 className="text-6xl font-black leading-[0.95] text-white">
            Every universe.
            <br />Every character.
          </h1>
          <p className="mt-7 max-w-md text-lg leading-8 text-slate-400">
            Browse the multiverse, inspect character files, and keep your favorite lifeforms close.
          </p>
        </div>
        <p className="text-sm text-slate-600">C-137 secure access terminal</p>
      </section>
      <section className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-md">
          <Link to="/characters" className="brand-font mb-8 inline-block text-sm tracking-[0.08em] text-lime-300 drop-shadow-[0_0_12px_rgba(168,255,53,0.45)] sm:mb-10 sm:text-base lg:hidden">
            RICKVERSE
          </Link>
          <Outlet />
        </div>
      </section>
    </main>
  )
}
