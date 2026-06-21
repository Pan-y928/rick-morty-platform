using RickMorty.Api.Contracts.Favorites;

namespace RickMorty.Api.Services.Favorites;

public interface IFavoriteCharacterService
{
    Task<IReadOnlyList<FavoriteCharacterResponse>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<AddFavoriteResult> AddAsync(
        Guid userId,
        int characterId,
        CancellationToken cancellationToken = default);

    Task<bool> RemoveAsync(
        Guid userId,
        int characterId,
        CancellationToken cancellationToken = default);
}
