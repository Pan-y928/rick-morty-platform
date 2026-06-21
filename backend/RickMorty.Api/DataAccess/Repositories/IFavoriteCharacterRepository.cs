using RickMorty.Api.Domain.Entities;

namespace RickMorty.Api.DataAccess.Repositories;

public interface IFavoriteCharacterRepository
{
    Task<IReadOnlyList<FavoriteCharacter>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<FavoriteCharacter?> FindAsync(
        Guid userId,
        int characterId,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        FavoriteCharacter favorite,
        CancellationToken cancellationToken = default);

    void Remove(FavoriteCharacter favorite);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
