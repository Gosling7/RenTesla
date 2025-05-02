using System.ComponentModel.DataAnnotations;

namespace RenTesla.API.Data.Requests;

public record RegisterParameter
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
}
