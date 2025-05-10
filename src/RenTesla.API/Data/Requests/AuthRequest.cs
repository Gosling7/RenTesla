namespace RenTesla.API.Data.Requests;

public record AuthRequest(
    string Email,
    string Password);