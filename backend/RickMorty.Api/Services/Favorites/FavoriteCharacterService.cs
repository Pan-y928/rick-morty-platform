using Microsoft.EntityFrameworkCore;
using RickMorty.Api.Contracts.Favorites;
using RickMorty.Api.DataAccess.External;
using RickMorty.Api.DataAccess.Repositories;
using RickMorty.Api.Domain.Entities;

namespace RickMorty.Api.Services.Favorites;

public sealed class FavoriteCharacterService(
    IFavoriteCharacterRepository repository,
    ICharacterApiClient characterApiClient) : IFavoriteCharacterService
{
    public async Task<IReadOnlyList<FavoriteCharacterResponse>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var favorites = await repository.GetAllAsync(userId, cancellationToken);
        return favorites.Select(ToResponse).ToList();
    }

    public async Task<AddFavoriteResult> AddAsync(
        Guid userId,
        int characterId,
        CancellationToken cancellationToken = default)
    {
        if (await repository.FindAsync(userId, characterId, cancellationToken) is not null)
        {
            return AddFavoriteResult.Failure(AddFavoriteError.AlreadyExists);
        }

        if (!await characterApiClient.ExistsAsync(characterId, cancellationToken))
        {
            return AddFavoriteResult.Failure(AddFavoriteError.CharacterNotFound);
        }

        var favorite = new FavoriteCharacter
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CharacterId = characterId,
            CreatedAtUtc = DateTime.UtcNow,
        };
        await repository.AddAsync(favorite, cancellationToken);

        try
        {
            await repository.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException)
        {
            // The unique database index also protects against concurrent duplicate requests.
            return AddFavoriteResult.Failure(AddFavoriteError.AlreadyExists);
        }

        return AddFavoriteResult.Success(ToResponse(favorite));
    }

    public async Task<bool> RemoveAsync(
        Guid userId,
        int characterId,
        CancellationToken cancellationToken = default)
    {
        var favorite = await repository.FindAsync(userId, characterId, cancellationToken);

        if (favorite is null)
        {
            return false;
        }

        repository.Remove(favorite);
        await repository.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static FavoriteCharacterResponse ToResponse(FavoriteCharacter favorite) =>
        new(favorite.CharacterId, favorite.CreatedAtUtc);
}
