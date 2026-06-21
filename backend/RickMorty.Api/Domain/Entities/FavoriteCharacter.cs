namespace RickMorty.Api.Domain.Entities;

public sealed class FavoriteCharacter
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public int CharacterId { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public ApplicationUser User { get; set; } = null!;
}
