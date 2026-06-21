import { Link } from 'react-router-dom'
import { PageIntro } from '../components/PageIntro'
import { getApiErrorMessage } from '../features/auth/api/getApiErrorMessage'
import { useCharactersByIds } from '../features/characters/hooks/useCharactersByIds'
import { useFavorites } from '../features/favorites/hooks/useFavorites'
import { useRemoveFavorite } from '../features/favorites/hooks/useRemoveFavorite'

function FavoritesSkeleton() {
  return (
    <div aria-label="Loading favorites" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-white/10">
          <div className="aspect-square animate-pulse bg-white/[0.06]" />
          <div className="space-y-3 p-5">
            <div className="h-6 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function FavoritesPage() {
  const favoritesQuery = useFavorites()
  const characterIds = favoritesQuery.data?.map(
    (favorite) => favorite.characterId,
  ) ?? []
  const charactersQuery = useCharactersByIds(characterIds)
  const removeMutation = useRemoveFavorite()
  const charactersById = new Map(
    charactersQuery.data?.map((character) => [character.id, character]),
  )

  if (favoritesQuery.isPending) return <FavoritesSkeleton />

  if (favoritesQuery.isError) {
    return (
      <div role="alert" className="rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-16 text-center">
        <h1 className="text-2xl font-black text-white">Favorites could not be loaded</h1>
        <p className="mt-2 text-slate-400">{getApiErrorMessage(favoritesQuery.error)}</p>
        <button type="button" onClick={() => favoritesQuery.refetch()} className="mt-6 rounded-xl border border-red-300/30 px-5 py-2.5 font-bold text-red-200">Try again</button>
      </div>
    )
  }

  if (favoritesQuery.data.length === 0) {
    return (
      <>
        <PageIntro eyebrow="Personal collection" title="My favorites" description="Characters saved to your account will appear here." />
        <div className="rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center">
          <p className="text-4xl" aria-hidden="true">🛸</p>
          <h2 className="mt-5 text-xl font-black text-white">No favorites yet</h2>
          <p className="mt-2 text-slate-500">Open a character profile to build your collection.</p>
          <Link to="/characters" className="mt-6 inline-block rounded-xl bg-lime-300 px-5 py-3 font-black text-[#071311]">Browse characters</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <PageIntro
        eyebrow="Personal collection"
        title="My favorites"
        description="Your saved characters, available whenever you return to this dimension."
        action={<p className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-400"><strong className="text-white">{favoritesQuery.data.length}</strong> saved</p>}
      />

      {charactersQuery.isPending ? <FavoritesSkeleton /> : null}

      {charactersQuery.isError ? (
        <div role="alert" className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6 text-red-200">
          Character details could not be loaded.{' '}
          <button type="button" onClick={() => charactersQuery.refetch()} className="font-bold underline">Try again</button>
        </div>
      ) : null}

      {charactersQuery.data ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {favoritesQuery.data.map((favorite) => {
            const character = charactersById.get(favorite.characterId)
            if (!character) return null

            const isRemoving =
              removeMutation.isPending &&
              removeMutation.variables === character.id

            return (
              <article key={character.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                <Link to={`/characters/${character.id}`} className="group block">
                  <div className="aspect-square overflow-hidden">
                    <img src={character.image} alt={character.name} loading="lazy" width="300" height="300" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  </div>
                  <div className="px-5 pt-5">
                    <h2 className="truncate text-xl font-black text-white group-hover:text-cyan-200">{character.name}</h2>
                    <p className="mt-2 text-sm text-slate-500">{character.species} · {character.status}</p>
                  </div>
                </Link>
                <div className="p-5">
                  <button
                    type="button"
                    disabled={isRemoving}
                    onClick={() => removeMutation.mutate(character.id)}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-300 hover:border-red-300/40 hover:text-red-200 disabled:opacity-50"
                  >
                    {isRemoving ? 'Removing…' : 'Remove favorite'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      ) : null}

      {removeMutation.error ? (
        <p role="alert" className="mt-5 text-center text-sm text-red-300">{getApiErrorMessage(removeMutation.error)}</p>
      ) : null}
    </>
  )
}
