using Microsoft.AspNetCore.Identity;
using RickMorty.Api.Contracts.Auth;
using RickMorty.Api.Domain.Entities;
using RickMorty.Api.Services.Token;

namespace RickMorty.Api.Services.Auth;

public sealed class AuthService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IJwtTokenService tokenService) : IAuthService
{
    public async Task<AuthOperationResult> RegisterAsync(
        RegisterRequest request,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var username = request.Username.Trim();
        var email = request.Email.Trim();

        if (await userManager.FindByNameAsync(username) is not null)
        {
            return AuthOperationResult.Failure(AuthOperationError.UsernameExists);
        }

        if (await userManager.FindByEmailAsync(email) is not null)
        {
            return AuthOperationResult.Failure(AuthOperationError.EmailExists);
        }

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            UserName = username,
            Email = email,
            LockoutEnabled = true,
            CreatedAtUtc = DateTime.UtcNow,
        };
        var identityResult = await userManager.CreateAsync(user, request.Password);

        if (!identityResult.Succeeded)
        {
            var errors = identityResult.Errors
                .GroupBy(error => error.Code)
                .ToDictionary(
                    group => group.Key,
                    group => group.Select(error => error.Description).ToArray());

            return AuthOperationResult.Failure(
                AuthOperationError.ValidationFailed,
                errors);
        }

        return AuthOperationResult.Success(CreateAuthResponse(user));
    }

    public async Task<AuthOperationResult> LoginAsync(
        LoginRequest request,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var user = await userManager.FindByNameAsync(request.Username.Trim());

        if (user is null)
        {
            return AuthOperationResult.Failure(AuthOperationError.InvalidCredentials);
        }

        var signInResult = await signInManager.CheckPasswordSignInAsync(
            user,
            request.Password,
            lockoutOnFailure: true);

        if (signInResult.IsLockedOut)
        {
            return AuthOperationResult.Failure(AuthOperationError.LockedOut);
        }

        return signInResult.Succeeded
            ? AuthOperationResult.Success(CreateAuthResponse(user))
            : AuthOperationResult.Failure(AuthOperationError.InvalidCredentials);
    }

    public async Task<AuthUserResponse?> GetCurrentUserAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var user = await userManager.FindByIdAsync(userId.ToString());
        return user is null ? null : ToUserResponse(user);
    }

    private AuthResponse CreateAuthResponse(ApplicationUser user)
    {
        var token = tokenService.CreateToken(user);
        return new AuthResponse(
            token.AccessToken,
            token.ExpiresAtUtc,
            ToUserResponse(user));
    }

    private static AuthUserResponse ToUserResponse(ApplicationUser user) =>
        new(
            user.Id,
            user.Name,
            user.UserName!,
            user.Email!,
            user.CreatedAtUtc);
}
