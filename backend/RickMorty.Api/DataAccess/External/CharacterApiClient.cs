using System.Net;

namespace RickMorty.Api.DataAccess.External;

public sealed class CharacterApiClient(HttpClient httpClient) : ICharacterApiClient
{
    public async Task<bool> ExistsAsync(
        int characterId,
        CancellationToken cancellationToken = default)
    {
        using var response = await httpClient.GetAsync(
            $"character/{characterId}",
            cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return false;
        }

        response.EnsureSuccessStatusCode();
        return true;
    }
}
