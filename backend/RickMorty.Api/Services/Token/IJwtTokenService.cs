using RickMorty.Api.Domain.Entities;

namespace RickMorty.Api.Services.Token;

public interface IJwtTokenService
{
    TokenResult CreateToken(ApplicationUser user);
}

public sealed record TokenResult(string AccessToken, DateTime ExpiresAtUtc);
