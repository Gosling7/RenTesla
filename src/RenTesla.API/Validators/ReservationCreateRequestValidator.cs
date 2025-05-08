using FluentValidation;
using RenTesla.API.Data.Requests;

namespace RenTesla.API.Validators;

public class ReservationCreateRequestValidator : AbstractValidator<ReservationCreateRequest>
{
    private const string From = nameof(ReservationCreateRequest.From);
    private const string To = nameof(ReservationCreateRequest.To);

    public ReservationCreateRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.PickUpLocationId)
            .NotEmpty();

        RuleFor(x => x.DropOffLocationId)
            .NotEmpty();

        RuleFor(x => x.CarModelId)
            .NotEmpty();

        RuleFor(x => x.From)
            .LessThan(x => x.To).WithMessage($"'{From}' must be less than '{To}'.")
            .GreaterThan(DateTime.UtcNow).WithMessage($"'{From}' must be in the future.");

        RuleFor(x => x.To)
            .GreaterThan(x => x.From).WithMessage($"'{To}' must be greater than '{From}'.")
            .GreaterThan(DateTime.UtcNow).WithMessage($"'{To}' must be in the future.");
    }
}
