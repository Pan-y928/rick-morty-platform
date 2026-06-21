import { type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageIntro } from '../components/PageIntro'
import { useCharacters } from '../features/characters/hooks/useCharacters'
import type { CharacterStatus } from '../features/characters/types/character'

const statusStyles: Record<CharacterStatus, string> = {
  Alive: 'bg-lime-300',
  Dead: 'bg-red-400',
  unknown: 'bg-slate-500',
}

function CharacterListSkeleton() {
  return (
    <div aria-label="Loading characters" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
          <div className="aspect-square animate-pulse bg-white/[0.06]" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function CharactersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const parsedPage = Number(searchParams.get('page') ?? '1')
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
  const name = searchParams.get('name')?.trim() ?? ''
  const status = searchParams.get('status') ?? ''
  const species = searchParams.get('species')?.trim() ?? ''

  const { data, isError, isFetching, isPending, refetch } = useCharacters({
    page,
    name: name || undefined,
    status: status || undefined,
    species: species || undefined,
  })

  const handleFilter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const nextParams = new URLSearchParams()

    for (const key of ['name', 'status', 'species']) {
      const value = String(formData.get(key) ?? '').trim()
      if (value) nextParams.set(key, value)
    }

    setSearchParams(nextParams)
  }

  const changePage = (nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams)
    if (nextPage === 1) nextParams.delete('page')
    else nextParams.set('page', String(nextPage))
    setSearchParams(nextParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => setSearchParams({})

  return (
    <>
      <PageIntro
        eyebrow="Public archive"
        title="Characters"
        description="Explore every known character across the Rick and Morty multiverse. Select a character to open their protected profile."
        action={
          data ? (
            <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-400">
              <strong className="text-white">{data.info.count}</strong> records
            </div>
          ) : undefined
        }
      />

      <form
        key={searchParams.toString()}
        onSubmit={handleFilter}
        className="mb-8 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[minmax(0,1fr)_180px_220px_auto]"
      >
        <label className="sr-only" htmlFor="character-name">Character name</label>
        <input
          id="character-name"
          name="name"
          defaultValue={name}
          placeholder="Search by character name..."
          className="rounded-xl border border-white/10 bg-[#0b1b18] px-4 py-3 text-white placeholder:text-slate-600"
        />

        <label className="sr-only" htmlFor="character-status">Status</label>
        <select
          id="character-status"
          name="status"
          defaultValue={status}
          className="rounded-xl border border-white/10 bg-[#0b1b18] px-4 py-3 text-white"
        >
          <option value="">Any status</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>

        <label className="sr-only" htmlFor="character-species">Species</label>
        <input
          id="character-species"
          name="species"
          defaultValue={species}
          placeholder="Filter by species..."
          className="rounded-xl border border-white/10 bg-[#0b1b18] px-4 py-3 text-white placeholder:text-slate-600"
        />

        <button
          type="submit"
          className="rounded-xl bg-lime-300 px-6 py-3 font-black text-[#071311] hover:bg-lime-200"
        >
          Search
        </button>
      </form>

      {isPending ? <CharacterListSkeleton /> : null}

      {isError ? (
        <div role="alert" className="rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-16 text-center">
          <h2 className="text-xl font-black text-white">The portal is unstable</h2>
          <p className="mt-2 text-slate-400">Characters could not be loaded. Check your connection and try again.</p>
          <button type="button" onClick={() => refetch()} className="mt-6 rounded-xl border border-red-300/30 px-5 py-2.5 font-bold text-red-200 hover:bg-red-300/10">Try again</button>
        </div>
      ) : null}

      {!isPending && !isError && data?.results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center">
          <p className="text-4xl" aria-hidden="true">🔭</p>
          <h2 className="mt-5 text-xl font-black text-white">No characters found</h2>
          <p className="mt-2 text-slate-500">Try a different name, status, or species.</p>
          <button type="button" onClick={clearFilters} className="mt-6 rounded-xl border border-white/15 px-5 py-2.5 font-bold text-slate-200 hover:border-cyan-300/40 hover:text-cyan-200">Clear filters</button>
        </div>
      ) : null}

      {data?.results.length ? (
        <>
          <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-4 ${isFetching ? 'opacity-60' : ''}`}>
            {data.results.map((character) => (
              <Link
                key={character.id}
                to={`/characters/${character.id}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] hover:-translate-y-1 hover:border-lime-300/40"
              >
                <div className="relative aspect-square overflow-hidden bg-white/[0.04]">
                  <img
                    src={character.image}
                    alt={character.name}
                    loading="lazy"
                    width="300"
                    height="300"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute right-3 top-3 rounded-full bg-[#071311]/85 px-3 py-1 text-xs font-bold backdrop-blur">
                    #{character.id}
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300">
                    <span className={`h-2 w-2 rounded-full ${statusStyles[character.status]}`} />
                    {character.status}
                  </div>
                  <h2 className="truncate text-xl font-black text-white group-hover:text-cyan-200">{character.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">{character.species} · {character.gender}</p>
                </div>
              </Link>
            ))}
          </div>

          <nav aria-label="Character pagination" className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              disabled={!data.info.prev || isFetching}
              onClick={() => changePage(page - 1)}
              className="rounded-xl border border-white/10 px-5 py-2.5 font-bold text-slate-200 hover:border-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Previous
            </button>
            <p className="min-w-32 text-center text-sm text-slate-400">
              Page <strong className="text-white">{page}</strong> of <strong className="text-white">{data.info.pages}</strong>
            </p>
            <button
              type="button"
              disabled={!data.info.next || isFetching}
              onClick={() => changePage(page + 1)}
              className="rounded-xl border border-white/10 px-5 py-2.5 font-bold text-slate-200 hover:border-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next
            </button>
          </nav>
        </>
      ) : null}
    </>
  )
}
