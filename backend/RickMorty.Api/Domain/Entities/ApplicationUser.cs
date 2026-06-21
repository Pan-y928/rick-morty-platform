using Microsoft.AspNetCore.Identity;

namespace RickMorty.Api.Domain.Entities;

public sealed class ApplicationUser : IdentityUser<Guid>
{
    public required string Name { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
