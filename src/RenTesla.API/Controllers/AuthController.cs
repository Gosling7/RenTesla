using Microsoft.AspNetCore.Mvc;
using RenTesla.API.Data;
using RenTesla.API.Data.DataTransferObjects;
using RenTesla.API.Data.Requests;
using RenTesla.API.Helpers;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _service;

    public AuthController(IAuthService service)
    {
        _service = service;
    }

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] AuthRequest request)
    {
        var result = await _service.RegisterAsync(request);
        if (result.IsValidationError)
        {
            var problemDetails = ProblemDetailsHelper.SimpleCreateValidationProblemDetails(
                HttpContext, result.Errors);

            return BadRequest(problemDetails);
        }

        return Ok();
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserInfoDto>> Login(
        [FromBody] AuthRequest request)
    {
        var result = await _service.LoginAsync(request, HttpContext);
        if (result.IsValidationError)
        {
            var problemDetails = ProblemDetailsHelper.SimpleCreateValidationProblemDetails(
                HttpContext, result.Errors);

            return BadRequest(problemDetails);
        }
        if (result.IsUnauthorizedError)
        {
            var problemDetails = ProblemDetailsHelper.SimpleUnauthorizedProblemDetails(
                HttpContext);

            return Unauthorized(problemDetails);
        }

        return Ok(result.Value);
    }

    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout()
    {
        await _service.LogoutAsync();

        return Ok();
    }

    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserInfoDto>> Me()
    {
        var result = await _service.GetUserInfoAsync(HttpContext);
        if (result.IsUnauthorizedError)
        {
            var problemDetails = ProblemDetailsHelper.SimpleUnauthorizedProblemDetails(
                HttpContext);

            return Unauthorized(problemDetails);
        }

        return Ok(result.Value);
    }
}
