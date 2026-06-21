using System.ComponentModel.DataAnnotations;

namespace RickMorty.Api.Contracts.Auth;

public sealed class LoginRequest
{
    [Required]
    public string Username { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;
}
