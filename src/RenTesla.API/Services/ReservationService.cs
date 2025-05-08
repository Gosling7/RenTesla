using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Models;
using RenTesla.API.Data.Requests;
using RenTesla.API.Interfaces;
using System.ComponentModel.DataAnnotations;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace RenTesla.API.Services;

public class ReservationService : IReservationService
{
    private readonly RenTeslaDbContext _dbContext;
    private readonly DateTime _utcNow = DateTime.UtcNow;
    private readonly EmailAddressAttribute _emailValidator = new();
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IValidator<ReservationCreateRequest> _validator;

    public ReservationService(RenTeslaDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        IValidator<ReservationCreateRequest> validator)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
        _validator = validator;
    }

    public async Task<ResultOld<IEnumerable<ReservationDto>>> GetByCodeAndMailAsync(
        string reservationCode, string email)
    {
        List<string> errors = [];
        ValidateEmail(email, errors);
        //if (reservationCode.Length != 8)
        //{
        //    errors.Add("Invalid reservation code format");
        //}
        if (errors.Count != 0)
        {
            return new ResultOld<IEnumerable<ReservationDto>>(data: [], errors: errors);
        }

        var reservation = await _dbContext.Reservations
            .Include(r => r.Car)
            .ThenInclude(c => c.Model)
            .Include(r => r.PickUpLocation)
            .Include(r => r.DropOffLocation)
            .Where(r =>
                r.ReservationCode == reservationCode
                && r.Email == email
                && r.Status != ReservationStatus.Completed)
            .Where(r => r.To > _utcNow)
            .FirstOrDefaultAsync();
        if (reservation is null)
        {
            return new ResultOld<IEnumerable<ReservationDto>>(data: [], errors: []);
        }

        return new ResultOld<IEnumerable<ReservationDto>>(
            data: [ new ReservationDto(
                Id: reservation.Id.ToString(),
                ReservationCode: reservationCode,
                CarModelName: reservation.Car.Model.Name,
                PickUpLocationName: reservation.PickUpLocation.Name,
                DropOffLocationName: reservation.DropOffLocation.Name,
                From: reservation.From,
                To: reservation.To,
                Status: reservation.Status,
                TotalCost: reservation.TotalCost)
            ],
            errors: []);
    }

    public async Task<ResultOld<IEnumerable<ReservationDto>>> GetByUserAsync(string email)
    {
        List<string> errors = [];

        ValidateEmail(email, errors);
        if (errors.Count != 0)
        {
            return new ResultOld<IEnumerable<ReservationDto>>(data: [], errors: errors);
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

        return new ResultOld<IEnumerable<ReservationDto>>(
            data: reservations,
            errors: []);
    }

    public async Task<Result<string>> CreateAsync(
        ReservationCreateRequest request)
    {
        // Non-db related validation
        var validationResult = _validator.Validate(request);
        if (!validationResult.IsValid)
        {
            var errors = ConvertToDictionary(validationResult);
            return new Result<string>(data: string.Empty, errors: errors);
        }

        // Db related validation
        Dictionary<string, List<string>> validationErrors = [];

        var availableCarModel = await _dbContext.CarModels.FindAsync(request.CarModelId);
        if (availableCarModel is null)
        {
            validationErrors.Add(
                $"{nameof(ReservationCreateRequest.CarModelId)}",
                ["Car model for given id not found."]);
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
                $"{nameof(ReservationCreateRequest.PickUpLocationId)}",
                ["Pick Up Location for given id not found."]);
        }

        var existingDropOffLocation = await _dbContext.Locations.FindAsync(request.DropOffLocationId);
        if (existingDropOffLocation is null)
        {
            validationErrors.Add(
                $"{nameof(ReservationCreateRequest.DropOffLocationId)}",
                ["Drop Off Location for given id not found."]);
        }

        if (validationErrors.Count > 0)
        {
            return new Result<string>(data: string.Empty, errors: validationErrors);
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

        return new Result<string>(data: reservation.ReservationCode, errors: []);
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

    public async Task<Result> ConfirmReturnAsync(string id)
    {
        List<string> errors = [];

        var user = _httpContextAccessor.HttpContext?.User;
        if (user is null)
        {

        }

        var isStaffRole = user.IsInRole("Staff");
        var email = user.Identity?.Name;

        var reservationId = Guid.Parse(id);

        var reservation = await _dbContext.Reservations.FindAsync(reservationId);
        if (reservation is null)
        {
            return new Result(errors: ["Reservation not found"]);
        }

        if (isStaffRole)
        {
            if (reservation.StaffConfirmedReturn)
            {
                return new Result(errors: ["Return already confirmed by staff"]);
            }

            reservation.StaffConfirmedReturn = true;
        }
        else
        {
            if (reservation.UserConfirmedReturn)
            {
                return new Result(errors: ["Return already confirmed by user"]);
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

        return new Result(errors: errors);
    }

    public async Task<ResultOld<IEnumerable<ReservationDto>>> GetActiveReservations()
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

        return new ResultOld<IEnumerable<ReservationDto>>(data: reservations, errors: []);
    }

    private void ValidateEmail(string email, List<string> errors)
    {
        if (!_emailValidator.IsValid(email))
        {
            errors.Add("Invalid email address format");
        }
    }
}
