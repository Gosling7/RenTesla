using FluentValidation;
using Microsoft.EntityFrameworkCore;
using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Models;
using RenTesla.API.Data.Requests;
using RenTesla.API.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace RenTesla.API.Services;

public class ReservationService : IReservationService
{
    private readonly DateTime _utcNow = DateTime.UtcNow;
    private readonly RenTeslaDbContext _dbContext;
    private readonly IValidator<ReservationCreateRequest> _reservationCreateValidator;
    private readonly IValidator<ReservationByCodeQueryRequest> _byCodeQueryValidator;

    public ReservationService(RenTeslaDbContext dbContext,
        IValidator<ReservationCreateRequest> createReservationValidator,
        IValidator<ReservationByCodeQueryRequest> queryByCodeValidator)
    {
        _dbContext = dbContext;
        _reservationCreateValidator = createReservationValidator;
        _byCodeQueryValidator = queryByCodeValidator;
    }

    public async Task<Result<IEnumerable<ReservationDto>>> GetByCodeAndMailAsync(
        ReservationByCodeQueryRequest request)
    {
        var validationResult = _byCodeQueryValidator.Validate(request);
        if (!validationResult.IsValid)
        {
            var errors = ConvertToDictionary(validationResult);
            return new Result<IEnumerable<ReservationDto>>(data: [], errors: errors,
                errorType: ErrorType.Validation);
        }

        var reservation = await _dbContext.Reservations
            .Include(r => r.Car)
            .ThenInclude(c => c.Model)
            .Include(r => r.PickUpLocation)
            .Include(r => r.DropOffLocation)
            .Where(r =>
                r.ReservationCode == request.ReservationCode
                && r.Email == request.Email
                && r.Status != ReservationStatus.Completed)
            .Where(r => r.To > _utcNow)
            .FirstOrDefaultAsync();
        if (reservation is null)
        {
            return new Result<IEnumerable<ReservationDto>>(data: [], errors: [],
                errorType: null);
        }

        return new Result<IEnumerable<ReservationDto>>(
            data:
            [
                new ReservationDto(
                    Id: reservation.Id.ToString(),
                    ReservationCode: reservation.ReservationCode,
                    CarModelName: reservation.Car.Model.Name,
                    PickUpLocationName: reservation.PickUpLocation.Name,
                    DropOffLocationName: reservation.DropOffLocation.Name,
                    From: reservation.From,
                    To: reservation.To,
                    Status: reservation.Status,
                    TotalCost: reservation.TotalCost)
            ],
            errors: [], errorType: null);
    }

    public async Task<Result<IEnumerable<ReservationDto>>> GetByUserAsync(string email)
    {
        var emailValidator = new InlineValidator<string>();
        emailValidator.RuleFor(x => x).EmailAddress();
        var validationResult = emailValidator.Validate(email);
        if (!validationResult.IsValid)
        {
            var errors = ConvertToDictionary(validationResult);
            return new Result<IEnumerable<ReservationDto>>(data: [], errors: errors,
                errorType: ErrorType.Validation);
        }

        var reservations = await _dbContext.Reservations
            .Include(r => r.Car)
            .ThenInclude(c => c.Model)
            .Include(r => r.PickUpLocation)
            .Include(r => r.DropOffLocation)
            .Where(r => r.Email == email)
            .Select(r => new ReservationDto(
                r.Id.ToString(),
                r.ReservationCode,
                r.Car.Model.Name,
                r.PickUpLocation.Name,
                r.DropOffLocation.Name,
                r.From,
                r.To,
                r.Status,
                r.TotalCost))
            .ToListAsync();

        return new Result<IEnumerable<ReservationDto>>(
            data: reservations,
            errors: [], errorType: null);
    }

    public async Task<Result<string>> CreateAsync(
        ReservationCreateRequest request)
    {
        // Non-db related validation
        var validationResult = _reservationCreateValidator.Validate(request);
        if (!validationResult.IsValid)
        {
            var errors = ConvertToDictionary(validationResult);
            return new Result<string>(data: string.Empty, errors: errors, 
                errorType: ErrorType.Validation);
        }

        // Db related validation
        Dictionary<string, List<string>> validationErrors = [];

        var availableCarModel = await _dbContext.CarModels.FindAsync(request.CarModelId);
        if (availableCarModel is null)
        {
            validationErrors.Add(
                key: $"{nameof(ReservationCreateRequest.CarModelId)}",
                value: ["Car model for given id not found."]);
        }

        var availableCar = await _dbContext.Cars
            .Where(c =>
                c.IsAvailable
                && c.ModelId == request.CarModelId
                && !c.Reservations.Any(r =>
                    request.To > r.From && request.From < r.To
                    && r.Status != ReservationStatus.Completed))
            .FirstOrDefaultAsync();
        if (availableCar is null)
        {
            // if key 'CarModelId' exists from validating nullability - add new error to it
            // otherwise simply add the new key with error
            var key = $"{nameof(ReservationCreateRequest.CarModelId)}";
            var message = "Car for given id not found.";
            if (validationErrors.TryGetValue(key, out _))
            {
                validationErrors[key].Add(message);
            }
            else
            {
                validationErrors.Add(key, [message]);
            }
        }

        var existingPickUpLocation = await _dbContext.Locations.FindAsync(request.PickUpLocationId);
        if (existingPickUpLocation is null)
        {
            validationErrors.Add(
                key: $"{nameof(ReservationCreateRequest.PickUpLocationId)}",
                value: ["Pick Up Location for given id not found."]);
        }

        var existingDropOffLocation = await _dbContext.Locations.FindAsync(request.DropOffLocationId);
        if (existingDropOffLocation is null)
        {
            validationErrors.Add(
                key: $"{nameof(ReservationCreateRequest.DropOffLocationId)}",
                value: ["Drop Off Location for given id not found."]);
        }

        if (validationErrors.Count > 0)
        {
            return new Result<string>(data: string.Empty, errors: validationErrors, 
                errorType: ErrorType.Validation);
        }

        var reservation = new Reservation
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            CarId = availableCar!.Id,
            PickUpLocationId = existingPickUpLocation!.Id,
            DropOffLocationId = existingDropOffLocation!.Id,
            From = request.From,
            To = request.To,
            DailyRate = availableCarModel!.BaseDailyRate,
            Car = availableCar,
            PickUpLocation = existingPickUpLocation,
            DropOffLocation = existingDropOffLocation,
            TotalCost = request.TotalCost
        };

        await _dbContext.Reservations.AddAsync(reservation);
        await _dbContext.SaveChangesAsync();

        return new Result<string>(data: reservation.ReservationCode, errors: [], errorType: null);
    }

    private static Dictionary<string, List<string>> ConvertToDictionary(
        FluentValidation.Results.ValidationResult validationResult)
    {
        return validationResult.Errors
            .GroupBy(e => e.PropertyName)
            .ToDictionary(
                g => g.Key,
                g => g.Select(e => e.ErrorMessage).ToList());
    }

    public async Task<Result> ConfirmReturnAsync(string id, HttpContext httpContext)
    {
        List<string> errorsOld = [];

        var user = httpContext.User;
        if (user is null)
        {

        }

        var isStaffRole = user.IsInRole("Staff");
        var email = user.Identity?.Name;

        var reservationId = Guid.Parse(id);

        var reservation = await _dbContext.Reservations.FindAsync(reservationId);
        if (reservation is null)
        {
            var errors = new Dictionary<string, List<string>>
            {
                { nameof(id), new List<string> { "Reservation not found." } }
            };

            return new Result(errors: errors, errorType: ErrorType.NotFound);
        }

        if (isStaffRole)
        {
            if (reservation.StaffConfirmedReturn)
            {
                var errors = new Dictionary<string, List<string>>
                {
                    { nameof(id), new List<string> { "Return already confirmed by staff." } }
                };

                return new Result(errors: errors, errorType: ErrorType.Validation);
            }

            reservation.StaffConfirmedReturn = true;
        }
        else
        {
            if (reservation.UserConfirmedReturn)
            {
                var errors = new Dictionary<string, List<string>>
                {
                    { nameof(id), new List<string> { "Return already confirmed by user." } }
                };

                return new Result(errors: errors, errorType: ErrorType.Validation);
            }
            reservation.UserConfirmedReturn = true;
        }

        if (reservation.StaffConfirmedReturn && reservation.UserConfirmedReturn)
        {
            var reservedCar = await _dbContext.Cars.FindAsync(reservation.CarId);
            reservedCar.CurrentLocation = reservation.DropOffLocation;
            reservedCar.CurrentLocationId = reservation.DropOffLocationId;
            reservation.Status = ReservationStatus.Completed;
            reservation.ReturnConfirmedDate = DateTime.UtcNow;
        }
        else
        {
            reservation.Status = ReservationStatus.PendingReturn;
        }

        await _dbContext.SaveChangesAsync();

        return new Result(errors: [], errorType: null);
    }

    public async Task<Result<IEnumerable<ReservationDto>>> GetActiveReservations()
    {
        var reservations = await _dbContext.Reservations
            .Include(r => r.Car)
            .ThenInclude(c => c.Model)
            .Where(r => r.Status == ReservationStatus.PendingReturn)
            .Select(r => new ReservationDto(
                r.Id.ToString(),
                r.ReservationCode,
                r.Car.Model.Name,
                r.PickUpLocation.Name,
                r.DropOffLocation.Name,
                r.From,
                r.To,
                r.Status,
                r.TotalCost))
            .ToListAsync();

        return new Result<IEnumerable<ReservationDto>>(data: reservations, errors: [], errorType: null);
    }
}
