using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RickMorty.Api.Domain.Entities;

namespace RickMorty.Api.DataAccess;

public sealed class ApplicationDbContext(
    DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
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
    }
}
