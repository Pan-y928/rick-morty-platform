using RickMorty.Api.Contracts.Auth;

namespace RickMorty.Api.Services.Auth;

public interface IAuthService
{
    Task<AuthOperationResult> RegisterAsync(
        RegisterRequest request,
        CancellationToken cancellationToken = default);

    Task<AuthOperationResult> LoginAsync(
        LoginRequest request,
        CancellationToken cancellationToken = default);

    Task<AuthUserResponse?> GetCurrentUserAsync(
        Guid userId,
        CancellationToken cancellationToken = default);
}
