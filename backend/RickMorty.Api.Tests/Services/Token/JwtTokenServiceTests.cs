using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RickMorty.Api.Domain.Entities;
using RickMorty.Api.Services.Token;

namespace RickMorty.Api.Tests.Services.Token;

public sealed class JwtTokenServiceTests
{
    private const string SigningKey = "test-signing-key-with-at-least-32-characters";

    [Fact]
    public void CreateToken_ProducesValidTokenWithExpectedUserClaims()
    {
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Name = "Rick Sanchez",
            UserName = "rick",
            Email = "rick@example.com",
        };
        var service = CreateService();

        var result = service.CreateToken(user);

        var tokenHandler = new JwtSecurityTokenHandler { MapInboundClaims = false };
        var principal = tokenHandler.ValidateToken(
            result.AccessToken,
            ValidationParameters(),
            out _);
        Assert.Equal(user.Id.ToString(), principal.FindFirstValue(JwtRegisteredClaimNames.Sub));
        Assert.Equal(user.UserName, principal.FindFirstValue(JwtRegisteredClaimNames.UniqueName));
        Assert.Equal(user.Email, principal.FindFirstValue(JwtRegisteredClaimNames.Email));
    }

    [Fact]
    public void CreateToken_UsesConfiguredExpiration()
    {
        var beforeCreation = DateTime.UtcNow.AddMinutes(29);
        var service = CreateService();
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Name = "Morty Smith",
            UserName = "morty",
            Email = "morty@example.com",
        };

        var result = service.CreateToken(user);

        Assert.InRange(
            result.ExpiresAtUtc,
            beforeCreation,
            DateTime.UtcNow.AddMinutes(31));
    }

    private static JwtTokenService CreateService() =>
        new(Options.Create(new JwtOptions
        {
            Key = SigningKey,
            Issuer = "RickMorty.Api.Tests",
            Audience = "RickMorty.Web.Tests",
            ExpirationMinutes = 30,
        }));

    private static TokenValidationParameters ValidationParameters() => new()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "RickMorty.Api.Tests",
        ValidAudience = "RickMorty.Web.Tests",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SigningKey)),
        ClockSkew = TimeSpan.Zero,
    };
}
