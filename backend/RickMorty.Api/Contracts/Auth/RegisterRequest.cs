using System.ComponentModel.DataAnnotations;

namespace RickMorty.Api.Contracts.Auth;

public sealed class RegisterRequest
{
    [Required, StringLength(100, MinimumLength = 2)]
    public string Name { get; init; } = string.Empty;

    [Required, StringLength(30, MinimumLength = 3)]
    [RegularExpression("^[a-zA-Z0-9._-]+$", ErrorMessage = "Username contains unsupported characters.")]
    public string Username { get; init; } = string.Empty;

    [Required, EmailAddress, StringLength(256)]
    public string Email { get; init; } = string.Empty;

    [Required, StringLength(100, MinimumLength = 8)]
    public string Password { get; init; } = string.Empty;
}
