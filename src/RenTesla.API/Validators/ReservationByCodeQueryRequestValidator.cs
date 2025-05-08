using FluentValidation;
using RenTesla.API.Data.Requests;

namespace RenTesla.API.Validators;

public class ReservationByCodeQueryRequestValidator : AbstractValidator<ReservationByCodeQueryRequest>
{
    public ReservationByCodeQueryRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.ReservationCode)
            .NotEmpty()
            .Length(36);
    }
}
