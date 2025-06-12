using Microsoft.AspNetCore.Identity;
using RenTesla.API.Data;
using RenTesla.API.Data.DataTransferObjects;
using RenTesla.API.Data.Requests;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Services;

public class AuthService : IAuthService
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IAuthRequestValidator _authValidator;

    public AuthService(
        SignInManager<IdentityUser> signInManager,
        UserManager<IdentityUser> userManager,
        IAuthRequestValidator registerValidator)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _authValidator = registerValidator;
    }

    public async Task<SimpleResult> RegisterAsync(AuthRequest request)
    {
        var errors = _authValidator.Validate(request);
        if (errors.Count > 0)
        {
            return SimpleResult.Failure(errors);
        }

        var user = new IdentityUser
        {
            UserName = request.Email,
            Email = request.Email
        };
        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var managerErrors = result.Errors.Select(e => 
                new Error(
                    property: nameof(request.Password),
                    message: e.Description,
                    type: ErrorType.Validation));

            errors.AddRange(managerErrors);

            return SimpleResult.Failure(errors);
        }

        await _signInManager.SignInAsync(user, isPersistent: false);

        return SimpleResult.Success();
    }

    public async Task<Result<UserInfoDto>> LoginAsync(AuthRequest request,
        HttpContext httpContext)
    {
        var errors = _authValidator.Validate(request);
        if (errors.Count > 0)
        {
            return Result<UserInfoDto>.Failure(errors);
        }

        var result = await _signInManager.PasswordSignInAsync(
            userName: request.Email,
            password: request.Password,
            isPersistent: false,
            lockoutOnFailure: false);
        if (!result.Succeeded)
        {
            errors.Add(new Error(
                property: null!,
                message: null!,
                type: ErrorType.Unauthorized));

            return Result<UserInfoDto>.Failure(errors);
        }

        var user = await _userManager.GetUserAsync(httpContext.User);
        var roles = await _userManager.GetRolesAsync(user);

        var userInfo = new UserInfoDto(Email: user.Email, Roles: roles);

        return Result<UserInfoDto>.Success(userInfo);
    }

    public async Task LogoutAsync()
    {
        await _signInManager.SignOutAsync();
    }

    public async Task<Result<UserInfoDto>> GetUserInfoAsync(HttpContext httpContext)
    {
        List<Error> errors = [];

        var user = await _userManager.GetUserAsync(httpContext.User);
        if (user is null)
        {
            errors.Add(new Error(
                property: null!,
                message: null!,
                type: ErrorType.Unauthorized));

            return Result<UserInfoDto>.Failure(errors);
        }

        var roles = await _userManager.GetRolesAsync(user);
        var userInfo = new UserInfoDto(Email: user.Email, Roles: roles);

        return Result<UserInfoDto>.Success(userInfo);
    }
}
