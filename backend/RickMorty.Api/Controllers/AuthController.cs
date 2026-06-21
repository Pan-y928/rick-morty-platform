using Microsoft.AspNetCore.Mvc;
using RickMorty.Api.Contracts.Auth;
using RickMorty.Api.Services.Auth;

namespace RickMorty.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    [ProducesResponseType<AuthResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponse>> Register(
        RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var result = await authService.RegisterAsync(request, cancellationToken);

        if (result.Succeeded)
        {
            return StatusCode(StatusCodes.Status201Created, result.Response);
        }

        if (result.Error == AuthOperationError.UsernameExists)
        {
            return ConflictProblem("Username is already registered.");
        }

        if (result.Error == AuthOperationError.EmailExists)
        {
            return ConflictProblem("Email is already registered.");
        }

        if (result.Error == AuthOperationError.ValidationFailed)
        {
            return BadRequest(new ValidationProblemDetails(result.ValidationErrors!)
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Registration validation failed",
            });
        }

        return Problem(statusCode: StatusCodes.Status500InternalServerError);
    }

    [HttpPost("login")]
    [ProducesResponseType<AuthResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status423Locked)]
    public async Task<ActionResult<AuthResponse>> Login(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        var result = await authService.LoginAsync(request, cancellationToken);

        if (result.Succeeded)
        {
            return Ok(result.Response);
        }

        if (result.Error == AuthOperationError.LockedOut)
        {
            return Problem(
                statusCode: StatusCodes.Status423Locked,
                title: "Account temporarily locked",
                detail: "Too many failed login attempts. Try again in five minutes.");
        }

        return Unauthorized(new ProblemDetails
        {
            Status = StatusCodes.Status401Unauthorized,
            Title = "Invalid credentials",
            Detail = "The username or password is incorrect.",
        });
    }

    private ObjectResult ConflictProblem(string detail) =>
        Problem(
            statusCode: StatusCodes.Status409Conflict,
            title: "Account already exists",
            detail: detail);
}
