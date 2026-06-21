import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#071311] px-6 text-center text-white">
      <div><p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">Dimension not found</p><h1 className="mt-4 text-7xl font-black text-lime-300">404</h1><p className="mt-5 text-slate-400">This portal leads nowhere.</p><Link to="/characters" className="mt-8 inline-block rounded-xl bg-lime-300 px-6 py-3 font-black text-[#071311]">Return to characters</Link></div>
    </main>
  )
}
