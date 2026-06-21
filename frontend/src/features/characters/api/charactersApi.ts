import axios from 'axios'
import type {
  Character,
  CharacterFilters,
  CharactersResponse,
  Episode,
} from '../types/character'

const rickMortyClient = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
  timeout: 10_000,
})

const emptyResponse: CharactersResponse = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
}

export async function getCharacters(filters: CharacterFilters) {
  try {
    const { data } = await rickMortyClient.get<CharactersResponse>('/character', {
      params: filters,
    })

    return data
  } catch (error) {
    // The external API returns 404 when a valid filter has no matching characters.
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return emptyResponse
    }

    throw error
  }
}

export async function getCharacter(id: number) {
  const { data } = await rickMortyClient.get<Character>(`/character/${id}`)
  return data
}

export async function getCharactersByIds(ids: number[]) {
  if (ids.length === 0) return []

  const chunks = Array.from(
    { length: Math.ceil(ids.length / 20) },
    (_, index) => ids.slice(index * 20, index * 20 + 20),
  )
  const responses = await Promise.all(
    chunks.map(async (chunk) => {
      const { data } = await rickMortyClient.get<Character | Character[]>(
        `/character/${chunk.join(',')}`,
      )
      return Array.isArray(data) ? data : [data]
    }),
  )

  return responses.flat()
}

export async function getEpisodes(ids: number[]) {
  if (ids.length === 0) return []

  const { data } = await rickMortyClient.get<Episode | Episode[]>(
    `/episode/${ids.join(',')}`,
  )

  return Array.isArray(data) ? data : [data]
}
