using System.ComponentModel.DataAnnotations;

namespace RenTesla.API.Data.Requests;

public record LoginRequest(
    [EmailAddress][Required] string Email,
    [Required] string Password);
