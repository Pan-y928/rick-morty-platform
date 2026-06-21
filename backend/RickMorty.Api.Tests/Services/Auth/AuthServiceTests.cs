using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Moq;
using RickMorty.Api.Contracts.Auth;
using RickMorty.Api.Domain.Entities;
using RickMorty.Api.Services.Auth;
using RickMorty.Api.Services.Token;

namespace RickMorty.Api.Tests.Services.Auth;

public sealed class AuthServiceTests
{
    private readonly Mock<UserManager<ApplicationUser>> userManager;
    private readonly Mock<SignInManager<ApplicationUser>> signInManager;
    private readonly Mock<IJwtTokenService> tokenService = new();

    public AuthServiceTests()
    {
        var userStore = new Mock<IUserStore<ApplicationUser>>();
        userManager = new Mock<UserManager<ApplicationUser>>(
            userStore.Object,
            Options.Create(new IdentityOptions()),
            new PasswordHasher<ApplicationUser>(),
            Array.Empty<IUserValidator<ApplicationUser>>(),
            Array.Empty<IPasswordValidator<ApplicationUser>>(),
            new UpperInvariantLookupNormalizer(),
            new IdentityErrorDescriber(),
            null!,
            NullLogger<UserManager<ApplicationUser>>.Instance);
        signInManager = new Mock<SignInManager<ApplicationUser>>(
            userManager.Object,
            new Mock<IHttpContextAccessor>().Object,
            new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>().Object,
            Options.Create(new IdentityOptions()),
            NullLogger<SignInManager<ApplicationUser>>.Instance,
            new Mock<IAuthenticationSchemeProvider>().Object,
            new Mock<IUserConfirmation<ApplicationUser>>().Object);
    }

    [Fact]
    public async Task RegisterAsync_WhenUsernameExists_ReturnsUsernameExists()
    {
        var existingUser = User("rick");
        userManager.Setup(manager => manager.FindByNameAsync("rick")).ReturnsAsync(existingUser);
        var service = CreateService();

        var result = await service.RegisterAsync(RegisterRequest("rick"));

        Assert.False(result.Succeeded);
        Assert.Equal(AuthOperationError.UsernameExists, result.Error);
        userManager.Verify(
            manager => manager.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task RegisterAsync_WhenIdentityRejectsPassword_ReturnsValidationErrors()
    {
        userManager.Setup(manager => manager.FindByNameAsync("rick")).ReturnsAsync((ApplicationUser?)null);
        userManager.Setup(manager => manager.FindByEmailAsync("rick@example.com")).ReturnsAsync((ApplicationUser?)null);
        userManager
            .Setup(manager => manager.CreateAsync(It.IsAny<ApplicationUser>(), "weak"))
            .ReturnsAsync(IdentityResult.Failed(
                new IdentityError { Code = "PasswordTooShort", Description = "Password is too short." }));
        var service = CreateService();

        var result = await service.RegisterAsync(RegisterRequest("rick", "weak"));

        Assert.Equal(AuthOperationError.ValidationFailed, result.Error);
        Assert.Equal("Password is too short.", result.ValidationErrors?["PasswordTooShort"][0]);
    }

    [Fact]
    public async Task LoginAsync_WhenCredentialsAreValid_ReturnsTokenAndUser()
    {
        var user = User("morty");
        userManager.Setup(manager => manager.FindByNameAsync("morty")).ReturnsAsync(user);
        signInManager
            .Setup(manager => manager.CheckPasswordSignInAsync(user, "Password1", true))
            .ReturnsAsync(SignInResult.Success);
        tokenService
            .Setup(service => service.CreateToken(user))
            .Returns(new TokenResult("jwt-token", DateTime.UtcNow.AddHours(1)));
        var service = CreateService();

        var result = await service.LoginAsync(new LoginRequest
        {
            Username = "morty",
            Password = "Password1",
        });

        Assert.True(result.Succeeded);
        Assert.Equal("jwt-token", result.Response?.AccessToken);
        Assert.Equal("morty", result.Response?.User.Username);
    }

    [Fact]
    public async Task LoginAsync_WhenAccountIsLockedOut_ReturnsLockedOut()
    {
        var user = User("morty");
        userManager.Setup(manager => manager.FindByNameAsync("morty")).ReturnsAsync(user);
        signInManager
            .Setup(manager => manager.CheckPasswordSignInAsync(user, "wrong", true))
            .ReturnsAsync(SignInResult.LockedOut);
        var service = CreateService();

        var result = await service.LoginAsync(new LoginRequest
        {
            Username = "morty",
            Password = "wrong",
        });

        Assert.Equal(AuthOperationError.LockedOut, result.Error);
        tokenService.Verify(
            service => service.CreateToken(It.IsAny<ApplicationUser>()),
            Times.Never);
    }

    private AuthService CreateService() =>
        new(userManager.Object, signInManager.Object, tokenService.Object);

    private static RegisterRequest RegisterRequest(
        string username,
        string password = "Password1") => new()
    {
        Name = "Rick Sanchez",
        Username = username,
        Email = "rick@example.com",
        Password = password,
    };

    private static ApplicationUser User(string username) => new()
    {
        Id = Guid.NewGuid(),
        Name = username,
        UserName = username,
        Email = $"{username}@example.com",
        CreatedAtUtc = DateTime.UtcNow,
    };
}
