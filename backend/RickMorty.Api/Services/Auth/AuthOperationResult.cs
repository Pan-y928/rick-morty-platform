using RickMorty.Api.Contracts.Auth;

namespace RickMorty.Api.Services.Auth;

public enum AuthOperationError
{
    None,
    UsernameExists,
    EmailExists,
    ValidationFailed,
    InvalidCredentials,
    LockedOut,
}

public sealed record AuthOperationResult(
    AuthResponse? Response,
    AuthOperationError Error,
    IDictionary<string, string[]>? ValidationErrors = null)
{
    public bool Succeeded => Error == AuthOperationError.None && Response is not null;

    public static AuthOperationResult Success(AuthResponse response) =>
        new(response, AuthOperationError.None);

    public static AuthOperationResult Failure(
        AuthOperationError error,
        IDictionary<string, string[]>? validationErrors = null) =>
        new(null, error, validationErrors);
}
