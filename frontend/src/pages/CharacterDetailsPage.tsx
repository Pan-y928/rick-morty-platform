import { useParams } from 'react-router-dom'
import { PageIntro } from '../components/PageIntro'

export function CharacterDetailsPage() {
  const { id } = useParams()

  return (
    <>
      <PageIntro eyebrow={`Character file #${id}`} title="Character profile" description="This protected route will display the selected character, episode history, and favorite controls." action={<button type="button" className="rounded-xl bg-lime-300 px-5 py-3 font-black text-[#071311]">Add to favorites</button>} />
      <div className="grid gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[320px_1fr]">
        <div className="aspect-square rounded-2xl bg-gradient-to-br from-cyan-400/20 to-lime-300/10" />
        <div className="grid content-start gap-5 sm:grid-cols-2">
          {['Name', 'Species', 'Gender', 'Status', 'Origin', 'Location'].map((item) => (
            <div key={item} className="rounded-xl border border-white/10 p-4"><p className="text-xs font-bold uppercase tracking-widest text-slate-500">{item}</p><p className="mt-2 font-bold text-white">API value</p></div>
          ))}
          <div className="sm:col-span-2"><h2 className="text-xl font-black">Episodes</h2><p className="mt-2 text-slate-400">Episode list will be loaded from the Rick and Morty API.</p></div>
        </div>
      </div>
    </>
  )
}
