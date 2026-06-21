using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RickMorty.Api.Domain.Entities;

namespace RickMorty.Api.DataAccess;

public sealed class ApplicationDbContext(
    DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<FavoriteCharacter> FavoriteCharacters => Set<FavoriteCharacter>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>(entity =>
        {
            entity.Property(user => user.Name)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(user => user.CreatedAtUtc)
                .IsRequired();
        });

        builder.Entity<FavoriteCharacter>(entity =>
        {
            entity.ToTable("FavoriteCharacters");
            entity.HasKey(favorite => favorite.Id);
            entity.HasIndex(favorite => new { favorite.UserId, favorite.CharacterId })
                .IsUnique();
            entity.Property(favorite => favorite.CharacterId).IsRequired();
            entity.Property(favorite => favorite.CreatedAtUtc).IsRequired();
            entity.HasOne(favorite => favorite.User)
                .WithMany(user => user.FavoriteCharacters)
                .HasForeignKey(favorite => favorite.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
