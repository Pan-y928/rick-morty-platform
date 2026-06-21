namespace RickMorty.Api.DataAccess.External;

public interface ICharacterApiClient
{
    Task<bool> ExistsAsync(
        int characterId,
        CancellationToken cancellationToken = default);
}
