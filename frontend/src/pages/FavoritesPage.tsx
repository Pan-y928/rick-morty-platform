import { PageIntro } from '../components/PageIntro'

export function FavoritesPage() {
  return (
    <>
      <PageIntro eyebrow="Personal collection" title="My favorites" description="Characters saved to your account will appear here." />
      <div className="rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center"><p className="text-4xl">🛸</p><h2 className="mt-5 text-xl font-black text-white">No favorites yet</h2><p className="mt-2 text-slate-500">Open a character profile to build your collection.</p></div>
    </>
  )
}
