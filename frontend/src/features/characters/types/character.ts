export type CharacterStatus = 'Alive' | 'Dead' | 'unknown'

export interface CharacterLocation {
  name: string
  url: string
}

export interface Character {
  id: number
  name: string
  status: CharacterStatus
  species: string
  type: string
  gender: string
  origin: CharacterLocation
  location: CharacterLocation
  image: string
  episode: string[]
  url: string
  created: string
}

export interface CharactersResponse {
  info: {
    count: number
    pages: number
    next: string | null
    prev: string | null
  }
  results: Character[]
}

export interface CharacterFilters {
  page: number
  name?: string
  status?: string
  species?: string
}
