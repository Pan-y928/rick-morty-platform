import { Link, useParams } from 'react-router-dom'
import { PageIntro } from '../components/PageIntro'
import { getApiErrorMessage } from '../features/auth/api/getApiErrorMessage'
import { useCharacter } from '../features/characters/hooks/useCharacter'
import { useEpisodes } from '../features/characters/hooks/useEpisodes'
import type { CharacterStatus } from '../features/characters/types/character'
import { useAddFavorite } from '../features/favorites/hooks/useAddFavorite'
import { useFavorites } from '../features/favorites/hooks/useFavorites'
import { useRemoveFavorite } from '../features/favorites/hooks/useRemoveFavorite'

const statusStyles: Record<CharacterStatus, string> = {
  Alive: 'bg-lime-300 text-[#071311]',
  Dead: 'bg-red-400 text-[#071311]',
  unknown: 'bg-slate-600 text-white',
}

function DetailSkeleton() {
  return (
    <div aria-label="Loading character" className="grid animate-pulse gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:gap-8 sm:rounded-3xl sm:p-6 md:grid-cols-[360px_1fr]">
      <div className="aspect-square rounded-2xl bg-white/[0.06]" />
      <div className="grid content-start gap-5 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-24 rounded-xl bg-white/[0.06]" />
        ))}
      </div>
    </div>
  )
}

export function CharacterDetailsPage() {
  const { id: idParam } = useParams()
  const parsedId = Number(idParam)
  const characterId = Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null
  const characterQuery = useCharacter(characterId)
  const episodesQuery = useEpisodes(characterQuery.data?.episode ?? [])
  const favoritesQuery = useFavorites()
  const addFavoriteMutation = useAddFavorite()
  const removeFavoriteMutation = useRemoveFavorite()
  const isFavorite = Boolean(
    characterId &&
      favoritesQuery.data?.some(
        (favorite) => favorite.characterId === characterId,
      ),
  )
  const isUpdatingFavorite =
    addFavoriteMutation.isPending || removeFavoriteMutation.isPending
  const favoriteError =
    addFavoriteMutation.error ??
    removeFavoriteMutation.error ??
    favoritesQuery.error

  const toggleFavorite = () => {
    if (!characterId) return

    addFavoriteMutation.reset()
    removeFavoriteMutation.reset()

    if (isFavorite) removeFavoriteMutation.mutate(characterId)
    else addFavoriteMutation.mutate(characterId)
  }

  if (characterId === null || characterQuery.isError) {
    return (
      <div className="rounded-3xl border border-red-400/20 bg-red-400/5 px-6 py-20 text-center">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-red-300">Unknown character</p>
        <h1 className="mt-4 text-4xl font-black text-white">Character file not found</h1>
        <p className="mt-3 text-slate-400">This character may belong to an undocumented dimension.</p>
        <Link to="/characters" className="mt-7 inline-block rounded-xl bg-lime-300 px-5 py-3 font-black text-[#071311]">Back to characters</Link>
      </div>
    )
  }

  if (characterQuery.isPending) return <DetailSkeleton />

  const character = characterQuery.data
  const details = [
    ['Species', character.species],
    ['Gender', character.gender],
    ['Type', character.type || 'Not specified'],
    ['Origin', character.origin.name],
    ['Last known location', character.location.name],
    ['First documented', new Date(character.created).toLocaleDateString()],
  ]

  return (
    <>
      <Link to="/characters" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-cyan-200">
        <span aria-hidden="true">←</span> Back to characters
      </Link>

      <PageIntro
        eyebrow={`Character file #${character.id}`}
        title={character.name}
        description={`${character.species} from ${character.origin.name}. Last seen at ${character.location.name}.`}
        action={
          <div className="text-left sm:text-right">
            <button
              type="button"
              aria-pressed={isFavorite}
              disabled={
                favoritesQuery.isPending ||
                favoritesQuery.isError ||
                isUpdatingFavorite
              }
              onClick={toggleFavorite}
              className={`w-full rounded-xl px-5 py-3 font-black disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${
                isFavorite
                  ? 'border border-lime-300/40 bg-lime-300/10 text-lime-200'
                  : 'bg-lime-300 text-[#071311] hover:bg-lime-200'
              }`}
            >
              {favoritesQuery.isPending
                ? 'Checking favorites…'
                : isUpdatingFavorite
                  ? 'Saving…'
                  : isFavorite
                    ? 'Saved to favorites'
                    : 'Add to favorites'}
            </button>
            {favoriteError ? (
              <p role="alert" className="mt-2 max-w-xs text-xs text-red-300">
                {getApiErrorMessage(favoriteError)}
              </p>
            ) : null}
          </div>
        }
      />

      <section aria-labelledby="character-information" className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:gap-8 sm:rounded-3xl sm:p-7 md:grid-cols-[360px_1fr]">
        <div>
          <div className="relative overflow-hidden rounded-2xl">
            <img src={character.image} alt={character.name} width="360" height="360" className="aspect-square h-full w-full object-cover" />
            <span className={`absolute bottom-4 left-4 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-widest ${statusStyles[character.status]}`}>
              {character.status}
            </span>
          </div>
        </div>

        <div>
          <h2 id="character-information" className="text-xl font-black text-white sm:text-2xl">Character information</h2>
          <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4">
            {details.map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
                <p className="mt-2 font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="episode-list" className="mt-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Appearances</p>
            <h2 id="episode-list" className="mt-2 text-3xl font-black text-white">Episodes</h2>
          </div>
          <p className="text-sm text-slate-500">{character.episode.length} total appearances</p>
        </div>

        {episodesQuery.isPending ? (
          <div aria-label="Loading episodes" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-xl bg-white/[0.06]" />)}
          </div>
        ) : null}

        {episodesQuery.isError ? (
          <div role="alert" className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
            <p className="font-bold text-red-200">Episodes could not be loaded.</p>
            <button type="button" onClick={() => episodesQuery.refetch()} className="mt-3 text-sm font-bold text-white underline underline-offset-4">Try again</button>
          </div>
        ) : null}

        {episodesQuery.data ? (
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {episodesQuery.data.map((episode) => (
              <li key={episode.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-cyan-300/30 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-md bg-cyan-300/10 px-2 py-1 text-xs font-black tracking-wider text-cyan-200">{episode.episode}</span>
                  <span className="text-xs text-slate-600">#{episode.id}</span>
                </div>
                <h3 className="mt-4 font-black text-white">{episode.name}</h3>
                <p className="mt-2 text-sm text-slate-500">Aired {episode.air_date}</p>
              </li>
            ))}
          </ol>
        ) : null}
      </section>
    </>
  )
}
