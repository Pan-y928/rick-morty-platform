using Microsoft.EntityFrameworkCore;
using RickMorty.Api.Domain.Entities;

namespace RickMorty.Api.DataAccess.Repositories;

public sealed class FavoriteCharacterRepository(ApplicationDbContext dbContext)
    : IFavoriteCharacterRepository
{
    public async Task<IReadOnlyList<FavoriteCharacter>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default) =>
        await dbContext.FavoriteCharacters
            .AsNoTracking()
            .Where(favorite => favorite.UserId == userId)
            .OrderByDescending(favorite => favorite.CreatedAtUtc)
            .ToListAsync(cancellationToken);

    public Task<FavoriteCharacter?> FindAsync(
        Guid userId,
        int characterId,
        CancellationToken cancellationToken = default) =>
        dbContext.FavoriteCharacters.SingleOrDefaultAsync(
            favorite => favorite.UserId == userId && favorite.CharacterId == characterId,
            cancellationToken);

    public async Task AddAsync(
        FavoriteCharacter favorite,
        CancellationToken cancellationToken = default) =>
        await dbContext.FavoriteCharacters.AddAsync(favorite, cancellationToken);

    public void Remove(FavoriteCharacter favorite) =>
        dbContext.FavoriteCharacters.Remove(favorite);

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        await dbContext.SaveChangesAsync(cancellationToken);
}
