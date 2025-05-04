namespace RenTesla.API.Data.DataTransferObjects;

public record UserInfoDto(
    string Email,
    IEnumerable<string> Roles);