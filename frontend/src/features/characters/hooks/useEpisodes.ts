import { useQuery } from '@tanstack/react-query'
import { getEpisodes } from '../api/charactersApi'

function getEpisodeIds(episodeUrls: string[]) {
  return episodeUrls
    .map((url) => Number(url.split('/').pop()))
    .filter((id) => Number.isInteger(id) && id > 0)
}

export function useEpisodes(episodeUrls: string[]) {
  const ids = getEpisodeIds(episodeUrls)

  return useQuery({
    queryKey: ['episodes', ids],
    queryFn: () => getEpisodes(ids),
    enabled: ids.length > 0,
  })
}
