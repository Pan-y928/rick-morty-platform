namespace RickMorty.Api.Contracts.Auth;

public sealed record AuthResponse(
    string AccessToken,
    DateTime ExpiresAtUtc,
    AuthUserResponse User);

public sealed record AuthUserResponse(
    Guid Id,
    string Name,
    string Username,
    string Email,
    DateTime CreatedAtUtc);
