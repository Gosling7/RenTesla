using RenTesla.API.Data;
using RenTesla.API.Data.DataTransferObjects;
using RenTesla.API.Data.Requests;

namespace RenTesla.API.Interfaces;
public interface IAuthService
{
    Task<SimpleResult> RegisterAsync(AuthRequest request);
    Task<Result<UserInfoDto>> LoginAsync(AuthRequest request, HttpContext httpContext);
    Task LogoutAsync();
    Task<Result<UserInfoDto>> GetUserInfoAsync(HttpContext httpContext);
}