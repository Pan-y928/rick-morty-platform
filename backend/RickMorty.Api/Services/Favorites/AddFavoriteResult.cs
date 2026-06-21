using RickMorty.Api.Contracts.Favorites;

namespace RickMorty.Api.Services.Favorites;

public enum AddFavoriteError
{
    None,
    AlreadyExists,
    CharacterNotFound,
}

public sealed record AddFavoriteResult(
    FavoriteCharacterResponse? Favorite,
    AddFavoriteError Error)
{
    public bool Succeeded => Error == AddFavoriteError.None && Favorite is not null;

    public static AddFavoriteResult Success(FavoriteCharacterResponse favorite) =>
        new(favorite, AddFavoriteError.None);

    public static AddFavoriteResult Failure(AddFavoriteError error) =>
        new(null, error);
}
