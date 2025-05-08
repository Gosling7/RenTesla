using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RenTesla.API.Data;
using RenTesla.API.Data.DataTransferObjects;
using RenTesla.API.Data.Requests;

namespace RenTesla.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;

    public AuthController(
        SignInManager<IdentityUser> signInManager,
        UserManager<IdentityUser> userManager)
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest parameter)
    {
        var user = new IdentityUser
        {
            UserName = parameter.Email,
            Email = parameter.Email
        };
        var result = await _userManager.CreateAsync(
            user: user,
            password: parameter.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        await _signInManager.SignInAsync(user, isPersistent: false);
        return Ok();
    }

    [HttpPost("login")]
    public async Task<ActionResult<ResultOld<UserInfoDto>>> Login(
        [FromBody] LoginRequest parameter)
    {
        var result = await _signInManager.PasswordSignInAsync(
            userName: parameter.Email,
            password: parameter.Password,
            isPersistent: false,
            lockoutOnFailure: false);
        if (!result.Succeeded)
        {
            return Unauthorized();
        }

        var user = await _userManager.GetUserAsync(User);
        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new ResultOld<UserInfoDto>(
            data: new UserInfoDto(Email: user.Email, Roles: roles),
            errors: []));
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }

    [HttpGet("me")]
    public async Task<ActionResult<ResultOld<UserInfoDto>>> Me()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized(new ResultOld<UserInfoDto>(data: null, errors: []));
        }

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new ResultOld<UserInfoDto>(
            data: new UserInfoDto(Email: user.Email, Roles: roles),
            errors: []));
    }
}
