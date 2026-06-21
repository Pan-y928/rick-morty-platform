import axios from 'axios'
import type {
  CharacterFilters,
  CharactersResponse,
} from '../types/character'

const charactersClient = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
  timeout: 10_000,
})

const emptyResponse: CharactersResponse = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
}

export async function getCharacters(filters: CharacterFilters) {
  try {
    const { data } = await charactersClient.get<CharactersResponse>('/character', {
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
