using Microsoft.EntityFrameworkCore;
using Moq;
using RickMorty.Api.DataAccess.External;
using RickMorty.Api.DataAccess.Repositories;
using RickMorty.Api.Domain.Entities;
using RickMorty.Api.Services.Favorites;

namespace RickMorty.Api.Tests.Services.Favorites;

public sealed class FavoriteCharacterServiceTests
{
    private readonly Mock<IFavoriteCharacterRepository> repository = new();
    private readonly Mock<ICharacterApiClient> characterApiClient = new();

    [Fact]
    public async Task AddAsync_WhenFavoriteAlreadyExists_ReturnsAlreadyExists()
    {
        var userId = Guid.NewGuid();
        repository
            .Setup(repo => repo.FindAsync(userId, 1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new FavoriteCharacter { UserId = userId, CharacterId = 1 });
        var service = CreateService();

        var result = await service.AddAsync(userId, 1);

        Assert.False(result.Succeeded);
        Assert.Equal(AddFavoriteError.AlreadyExists, result.Error);
        characterApiClient.Verify(
            client => client.ExistsAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task AddAsync_WhenCharacterDoesNotExist_ReturnsCharacterNotFound()
    {
        var userId = Guid.NewGuid();
        repository
            .Setup(repo => repo.FindAsync(userId, 999, It.IsAny<CancellationToken>()))
            .ReturnsAsync((FavoriteCharacter?)null);
        characterApiClient
            .Setup(client => client.ExistsAsync(999, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        var service = CreateService();

        var result = await service.AddAsync(userId, 999);

        Assert.False(result.Succeeded);
        Assert.Equal(AddFavoriteError.CharacterNotFound, result.Error);
        repository.Verify(
            repo => repo.AddAsync(It.IsAny<FavoriteCharacter>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task AddAsync_WhenValid_PersistsAndReturnsFavorite()
    {
        var userId = Guid.NewGuid();
        repository
            .Setup(repo => repo.FindAsync(userId, 42, It.IsAny<CancellationToken>()))
            .ReturnsAsync((FavoriteCharacter?)null);
        characterApiClient
            .Setup(client => client.ExistsAsync(42, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        repository
            .Setup(repo => repo.AddAsync(It.IsAny<FavoriteCharacter>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        repository
            .Setup(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        var service = CreateService();

        var result = await service.AddAsync(userId, 42);

        Assert.True(result.Succeeded);
        Assert.Equal(42, result.Favorite?.CharacterId);
        repository.Verify(
            repo => repo.AddAsync(
                It.Is<FavoriteCharacter>(favorite =>
                    favorite.UserId == userId && favorite.CharacterId == 42),
                It.IsAny<CancellationToken>()),
            Times.Once);
        repository.Verify(
            repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task AddAsync_WhenConcurrentInsertConflicts_ReturnsAlreadyExists()
    {
        var userId = Guid.NewGuid();
        repository
            .Setup(repo => repo.FindAsync(userId, 7, It.IsAny<CancellationToken>()))
            .ReturnsAsync((FavoriteCharacter?)null);
        characterApiClient
            .Setup(client => client.ExistsAsync(7, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        repository
            .Setup(repo => repo.AddAsync(It.IsAny<FavoriteCharacter>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        repository
            .Setup(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(new DbUpdateException());
        var service = CreateService();

        var result = await service.AddAsync(userId, 7);

        Assert.False(result.Succeeded);
        Assert.Equal(AddFavoriteError.AlreadyExists, result.Error);
    }

    [Fact]
    public async Task RemoveAsync_WhenFavoriteDoesNotExist_ReturnsFalse()
    {
        var userId = Guid.NewGuid();
        repository
            .Setup(repo => repo.FindAsync(userId, 5, It.IsAny<CancellationToken>()))
            .ReturnsAsync((FavoriteCharacter?)null);
        var service = CreateService();

        var removed = await service.RemoveAsync(userId, 5);

        Assert.False(removed);
        repository.Verify(
            repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task RemoveAsync_WhenFavoriteExists_RemovesAndSaves()
    {
        var userId = Guid.NewGuid();
        var favorite = new FavoriteCharacter { UserId = userId, CharacterId = 5 };
        repository
            .Setup(repo => repo.FindAsync(userId, 5, It.IsAny<CancellationToken>()))
            .ReturnsAsync(favorite);
        repository
            .Setup(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        var service = CreateService();

        var removed = await service.RemoveAsync(userId, 5);

        Assert.True(removed);
        repository.Verify(repo => repo.Remove(favorite), Times.Once);
        repository.Verify(
            repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    private FavoriteCharacterService CreateService() =>
        new(repository.Object, characterApiClient.Object);
}
