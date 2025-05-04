using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
    public async Task<IActionResult> Login([FromBody] LoginRequest parameter)
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

        return Ok();
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }

    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(User.Identity?.Name ?? "");
    }
}
