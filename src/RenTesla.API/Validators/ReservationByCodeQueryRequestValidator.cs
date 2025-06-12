using RenTesla.API.Data;
using RenTesla.API.Data.Requests;
using RenTesla.API.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace RenTesla.API.Validators;

public class ReservationByCodeQueryRequestValidator : IReservationByCodeQueryRequestValidator
{
    public List<Error> Validate(ReservationByCodeQueryRequest request)
    {
        EmailAddressAttribute _emailValidator = new();
        List<Error> errors = [];

        if (string.IsNullOrWhiteSpace(request.Email)
            || !_emailValidator.IsValid(request.Email))
        {
            errors.Add(new Error(
                property: nameof(request.Email),
                message: $"Must be a valid email address",
                type: ErrorType.Validation));
        }

        var nameOfReservationCode = nameof(request.ReservationCode);
        if (string.IsNullOrWhiteSpace(request.ReservationCode))
        {
            errors.Add(new Error(
                property: nameOfReservationCode,
                message: $"Must be provided",
                type: ErrorType.Validation));
        }
        if (request.ReservationCode.Length != 36)
        {
            errors.Add(new Error(
                property: nameOfReservationCode,
                message: $"Must be of length 36",
                type: ErrorType.Validation));
        }

        return errors;
    }
}
