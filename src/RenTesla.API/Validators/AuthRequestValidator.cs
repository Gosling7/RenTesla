using RenTesla.API.Data;
using RenTesla.API.Data.Requests;
using RenTesla.API.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace RenTesla.API.Validators;

public class AuthRequestValidator : IAuthRequestValidator
{
    public List<Error> Validate(AuthRequest request)
    {
        EmailAddressAttribute _emailValidator = new();
        List<Error> errors = [];

        if (string.IsNullOrWhiteSpace(request.Email)
            || !_emailValidator.IsValid(request.Email))
        {
            errors.Add(new Error(
                property: nameof(request.Email),
                message: $"Must be a valid email address",
                type: SimpleErrorType.Validation));
        }

        var nameOfPassword = nameof(request.Password);
        if (string.IsNullOrWhiteSpace(request.Password))
        {
            errors.Add(new Error(
                property: nameOfPassword,
                message: $"Must be provided",
                type: SimpleErrorType.Validation));
        }
        if (request.Password.Length < 6)
        {
            errors.Add(new Error(
                property: nameOfPassword,
                message: $"Must at least 6 characters long",
                type: SimpleErrorType.Validation));
        }

        return errors;
    }
}
