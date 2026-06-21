using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RickMorty.Api.Contracts.Favorites;
using RickMorty.Api.Services.Favorites;

namespace RickMorty.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/users/me/favorites")]
public sealed class FavoritesController(IFavoriteCharacterService favoriteService)
    : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<FavoriteCharacterResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IReadOnlyList<FavoriteCharacterResponse>>> GetAll(
        CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var favorites = await favoriteService.GetAllAsync(userId, cancellationToken);
        return Ok(favorites);
    }

    [HttpPost("{characterId:int}")]
    [ProducesResponseType<FavoriteCharacterResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<FavoriteCharacterResponse>> Add(
        [FromRoute] int characterId,
        CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        if (characterId <= 0)
        {
            return CharacterNotFound();
        }

        var result = await favoriteService.AddAsync(
            userId,
            characterId,
            cancellationToken);

        if (result.Succeeded)
        {
            return CreatedAtAction(nameof(GetAll), result.Favorite);
        }

        return result.Error == AddFavoriteError.AlreadyExists
            ? Problem(
                statusCode: StatusCodes.Status409Conflict,
                title: "Character already saved",
                detail: "This character is already in your favorites.")
            : CharacterNotFound();
    }

    [HttpDelete("{characterId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Remove(
        [FromRoute] int characterId,
        CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var removed = await favoriteService.RemoveAsync(
            userId,
            characterId,
            cancellationToken);

        return removed
            ? NoContent()
            : Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Favorite not found",
                detail: "This character is not in your favorites.");
    }

    private bool TryGetUserId(out Guid userId) =>
        Guid.TryParse(User.FindFirstValue(JwtRegisteredClaimNames.Sub), out userId);

    private ObjectResult CharacterNotFound() =>
        Problem(
            statusCode: StatusCodes.Status404NotFound,
            title: "Character not found",
            detail: "The requested Rick and Morty character does not exist.");
}
