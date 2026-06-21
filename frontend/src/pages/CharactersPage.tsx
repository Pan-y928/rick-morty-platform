import { Link } from 'react-router-dom'
import { PageIntro } from '../components/PageIntro'

const demoCharacters = [
  { id: 1, name: 'Rick Sanchez', species: 'Human', status: 'Alive' },
  { id: 2, name: 'Morty Smith', species: 'Human', status: 'Alive' },
  { id: 3, name: 'Summer Smith', species: 'Human', status: 'Alive' },
  { id: 4, name: 'Beth Smith', species: 'Human', status: 'Alive' },
]

export function CharactersPage() {
  return (
    <>
      <PageIntro eyebrow="Public archive" title="Characters" description="Explore every known character across the Rick and Morty multiverse. Live API data comes next." />
      <div className="mb-8 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input aria-label="Search characters" placeholder="Search by character name..." className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600" />
        <button type="button" className="rounded-xl border border-white/10 px-6 py-3 font-bold text-slate-300 hover:border-cyan-300/50 hover:text-cyan-200">Filter</button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {demoCharacters.map((character, index) => (
          <Link key={character.id} to={`/characters/${character.id}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] hover:-translate-y-1 hover:border-lime-300/40">
            <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-cyan-400/15 to-lime-300/10 text-6xl font-black text-white/10">{String(index + 1).padStart(2, '0')}</div>
            <div className="p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-lime-300"><span className="h-2 w-2 rounded-full bg-lime-300" />{character.status}</div>
              <h2 className="text-xl font-black text-white group-hover:text-cyan-200">{character.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{character.species}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
