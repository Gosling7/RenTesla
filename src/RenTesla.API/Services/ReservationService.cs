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
    private readonly RenTeslaDbContext _dbContext;
    private readonly IReservationByCodeQueryRequestValidator _byCodeQueryValidator;
    private readonly IReservationCreateRequestValidator _createReservationValidator;
    private readonly IAuthService _authService;

    public ReservationService(RenTeslaDbContext dbContext,
        IReservationByCodeQueryRequestValidator queryByCodeValidator,
        IReservationCreateRequestValidator createReservationValidator,
        IAuthService authService)
    {
        _dbContext = dbContext;
        _byCodeQueryValidator = queryByCodeValidator;
        _createReservationValidator = createReservationValidator;
        _authService = authService;
    }

    public async Task<Result<ReservationDto>> GetByCodeAndMailAsync(
        ReservationByCodeQueryRequest request)
    {
        var errors = _byCodeQueryValidator.Validate(request);
        if (errors.Count > 0)
        {
            return Result<ReservationDto>.Failure(errors);
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
            .Where(r => r.To > DateTime.UtcNow)
            .FirstOrDefaultAsync();
        if (reservation is null)
        {
            return Result<ReservationDto>.Success(null!);
        }


        return Result<ReservationDto>.Success(
            new ReservationDto(
                Id: reservation.Id.ToString(),
                ReservationCode: reservation.ReservationCode,
                CarModelName: reservation.Car.Model.Name,
                PickUpLocationName: reservation.PickUpLocation.Name,
                DropOffLocationName: reservation.DropOffLocation.Name,
                From: reservation.From,
                To: reservation.To,
                Status: reservation.Status,
                TotalCost: reservation.TotalCost));
    }

    public async Task<Result<IEnumerable<ReservationDto>>> GetByUserAsync(string email)
    {
        List<Error> errors = [];

        EmailAddressAttribute emailValidator = new();
        if (string.IsNullOrWhiteSpace(email)
            || !emailValidator.IsValid(email))
        {
            errors.Add(new Error(
                property: nameof(email),
                message: $"Must be a valid email address",
                type: ErrorType.Validation));

            return Result<IEnumerable<ReservationDto>>.Failure(errors);
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

        return Result<IEnumerable<ReservationDto>>.Success(reservations);
    }

    public async Task<Result<string>> CreateAsync(
        ReservationCreateRequest request)
    {
        // Non-db related validation
        var errors = _createReservationValidator.Validate(request);
        if (errors.Count > 0)
        {
            return Result<string>.Failure(errors);
        }

        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            if (request.CreateAccount is not null
            && request.CreateAccount == true)
            {
                var authRequest = new AuthRequest(request.Email, request.Password);

                var registerResult = await _authService.RegisterAsync(authRequest);
                if (registerResult.IsValidationError)
                {
                    await transaction.RollbackAsync();
                    return Result<string>.Failure(registerResult.Errors);
                }
            }

            // Db related validation
            var availableCarModel = await _dbContext.CarModels.FindAsync(request.CarModelId);
            if (availableCarModel is null)
            {
                errors.Add(new Error(
                    property: nameof(request.CarModelId),
                    message: $"No car model found with the given id",
                    type: ErrorType.Validation));
            }

            var availableCar = await _dbContext.Cars
                .Include(c => c.Reservations)
                .Where(c =>
                    c.IsAvailable
                    && c.CurrentLocationId == request.PickUpLocationId
                    && c.ModelId == request.CarModelId
                    && !c.Reservations.Any(r =>
                        request.To > r.From && request.From < r.To
                        && r.Status != ReservationStatus.Completed))
                .FirstOrDefaultAsync();
            if (availableCar is null)
            {
                errors.Add(new Error(
                    property: nameof(request.CarModelId),
                    message: $"No car found with the given model id",
                    type: ErrorType.Validation));
            }

            var existingPickUpLocation = await _dbContext.Locations.FindAsync(request.PickUpLocationId);
            if (existingPickUpLocation is null)
            {
                errors.Add(new Error(
                    property: nameof(request.CarModelId),
                    message: $"No pickup location found with the given id",
                    type: ErrorType.Validation));
            }

            var existingDropOffLocation = await _dbContext.Locations.FindAsync(request.DropOffLocationId);
            if (existingDropOffLocation is null)
            {
                errors.Add(new Error(
                    property: nameof(request.CarModelId),
                    message: $"No drop off location found with the given id",
                    type: ErrorType.Validation));
            }

            if (errors.Count > 0)
            {
                return Result<string>.Failure(errors);
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

            await transaction.CommitAsync();

            return Result<string>.Success(reservation.ReservationCode);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();

            errors.Add(new Error(
                property: nameof(request.CreateAccount),
                message: ex.Message,
                type: ErrorType.Validation));
            return Result<string>.Failure(errors);
        }
    }

    public async Task<SimpleResult> ConfirmReturnAsync(Guid id, HttpContext httpContext)
    {
        List<Error> errors = [];

        var reservation = await _dbContext.Reservations.FindAsync(id);
        if (reservation is null)
        {
            errors.Add(new Error(
                property: nameof(id),
                message: "No reservation found with the given ID.",
                type: ErrorType.NotFound));

            return SimpleResult.Failure(errors);
        }

        var isStaffRole = httpContext.User.IsInRole("Staff");
        if (isStaffRole)
        {
            if (reservation.StaffConfirmedReturn)
            {
                errors.Add(new Error(
                    property: nameof(id),
                    message: "Return already confirmed by staff.",
                    type: ErrorType.Validation));

                return SimpleResult.Failure(errors);
            }

            reservation.StaffConfirmedReturn = true;
        }
        else
        {
            if (reservation.UserConfirmedReturn)
            {
                errors.Add(new Error(
                    property: nameof(id),
                    message: "Return already confirmed by user.",
                    type: ErrorType.Validation));

                return SimpleResult.Failure(errors);
            }
            reservation.UserConfirmedReturn = true;
        }

        if (reservation.StaffConfirmedReturn && reservation.UserConfirmedReturn)
        {
            var reservedCar = await _dbContext.Cars.FindAsync(reservation.CarId);
            if (reservedCar is null)
            {
                errors.Add(new Error(
                    property: nameof(id),
                    message: "Car from the reservation not found.",
                    type: ErrorType.Validation));

                return SimpleResult.Failure(errors);
            }

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

        return SimpleResult.Success();
    }

    public async Task<IEnumerable<ReservationDto>> GetActiveReservations()
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

        return reservations;
    }
}
