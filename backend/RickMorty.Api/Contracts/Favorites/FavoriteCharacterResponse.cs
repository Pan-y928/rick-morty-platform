namespace RickMorty.Api.Contracts.Favorites;

public sealed record FavoriteCharacterResponse(
    int CharacterId,
    DateTime CreatedAtUtc);
