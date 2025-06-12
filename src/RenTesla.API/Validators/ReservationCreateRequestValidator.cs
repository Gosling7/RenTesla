using RenTesla.API.Data;
using RenTesla.API.Data.Requests;
using RenTesla.API.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace RenTesla.API.Validators;

public class ReservationCreateRequestValidator : IReservationCreateRequestValidator
{
    public List<Error> Validate(ReservationCreateRequest request)
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

        var nameOfTotalCost = nameof(request.TotalCost);
        if (request.TotalCost <= 0)
        {
            errors.Add(new Error(
                property: nameOfTotalCost,
                message: $"Must be greater than 0",
                type: ErrorType.Validation));
        }

        var nameOfFrom = nameof(request.From);
        var nameOfTo = nameof(request.To);
        if (request.From < DateTime.UtcNow)
        {
            errors.Add(new Error(
                property: nameOfFrom,
                message: $"Must be in the future",
                type: ErrorType.Validation));
        }
        if (request.To < DateTime.UtcNow)
        {
            errors.Add(new Error(
                property: nameOfTo,
                message: $"Must be in the future",
                type: ErrorType.Validation));
        }
        if (request.From > request.To)
        {
            errors.Add(new Error(
                property: nameOfFrom,
                message: $"Must be greater than '{nameOfTo}'",
                type: ErrorType.Validation));
        }

        if (request.CarModelId == Guid.Empty)
        {
            errors.Add(new Error(
                property: nameof(request.CarModelId),
                message: $"Must be provided",
                type: ErrorType.Validation));
        }
        if (request.PickUpLocationId == Guid.Empty)
        {
            errors.Add(new Error(
                property: nameof(request.PickUpLocationId),
                message: $"Must be provided",
                type: ErrorType.Validation));
        }
        if (request.DropOffLocationId == Guid.Empty)
        {
            errors.Add(new Error(
                property: nameof(request.DropOffLocationId),
                message: $"Must be provided",
                type: ErrorType.Validation));
        }

        return errors;
    }
}
