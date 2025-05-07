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
    private readonly DateTime _utcNow = DateTime.UtcNow;
    private readonly EmailAddressAttribute _emailValidator = new();
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ReservationService(RenTeslaDbContext dbContext, 
        IHttpContextAccessor httpContextAccessor)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Result<IEnumerable<ReservationDto>>> GetByCodeAndMailAsync(
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
            return new Result<IEnumerable<ReservationDto>>(data: [], errors: errors);
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
            return new Result<IEnumerable<ReservationDto>>(
            data: [],
            errors: []);
        }

        return new Result<IEnumerable<ReservationDto>>(
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

    public async Task<Result<IEnumerable<ReservationDto>>> GetByUserAsync(string email)
    {
        List<string> errors = [];

        ValidateEmail(email, errors);
        if (errors.Count != 0)
        {
            return new Result<IEnumerable<ReservationDto>>(data: [], errors: errors);
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
            errors: []);
    }

    public async Task<Result<string>> CreateAsync(
        ReservationCreateRequest request)
    {
        List<string> errors = [];

        ParseRequest(request, errors,
            out Guid carModelId,
            out Guid pickUpLocationId, out Guid dropOffLocationId,
            out DateTime fromDate, out DateTime toDate);
        if (errors.Count != 0)
        {
            return new Result<string>(data: string.Empty, errors: errors);
        }

        if (fromDate > toDate)
        {
            errors.Add("To date cannot be greater than From date");
            return new Result<string>(data: string.Empty, errors: errors);
        }

        var availableCarModel = await _dbContext.CarModels.FindAsync(carModelId);
        if (availableCarModel is null)
        {
            errors.Add("Car model not found");
        }

        var availableCar = await _dbContext.Cars
            .Where(c =>
                c.IsAvailable
                && c.ModelId == carModelId
                && !c.Reservations.Any(r =>                    
                    toDate > r.From && fromDate < r.To
                    && r.Status != ReservationStatus.Completed))
            .FirstOrDefaultAsync();

        if (availableCar is null)
        {
            errors.Add("No available car for this model");
        }

        var existingPickUpLocation = await _dbContext.Locations.FindAsync(pickUpLocationId);
        if (existingPickUpLocation is null)
        {
            errors.Add("Invalid pick-up location");
        }

        var existingDropOffLocation = await _dbContext.Locations.FindAsync(dropOffLocationId);
        if (existingDropOffLocation is null)
        {
            errors.Add("Invalid drop-off location");
        }

        if (errors.Count != 0)
        {
            return new Result<string>(
                data: string.Empty,
                errors: errors);
        }

        var reservation = new Reservation
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            CarId = availableCar!.Id,
            PickUpLocationId = existingPickUpLocation!.Id,
            DropOffLocationId = existingDropOffLocation!.Id,
            From = fromDate,
            To = toDate,
            DailyRate = availableCarModel!.BaseDailyRate,
            Car = availableCar,
            PickUpLocation = existingPickUpLocation,
            DropOffLocation = existingDropOffLocation,
            TotalCost = request.TotalCost
        };

        await _dbContext.Reservations.AddAsync(reservation);
        await _dbContext.SaveChangesAsync();

        return new Result<string>(
            data: reservation.ReservationCode,
            errors: []);
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

        return new Result<IEnumerable<ReservationDto>>(data: reservations, errors: []);
    }

    private void ValidateEmail(string email, List<string> errors)
    {
        if (!_emailValidator.IsValid(email))
        {
            errors.Add("Invalid email address format");
        }
    }

    private void ParseRequest(ReservationCreateRequest parameters, List<string> errors,
        out Guid carModelId,
        out Guid pickUpLocationId, out Guid dropOffLocationId,
        out DateTime fromDate, out DateTime toDate)
    {
        ValidateEmail(parameters.Email, errors);
        if (!Guid.TryParse(parameters.CarModelId, out carModelId))
        {
            errors.Add("Invalid CarModelId GUID format");
        }
        if (!Guid.TryParse(parameters.PickUpLocationId, out pickUpLocationId))
        {
            errors.Add("Invalid PickUpLocationId GUID format");
        }
        if (!Guid.TryParse(parameters.DropOffLocationId, out dropOffLocationId))
        {
            errors.Add("Invalid DropOffLocationId GUID format");
        }
        if (!DateTime.TryParse(parameters.From, out fromDate))
        {
            errors.Add("Invalid From date format");
        }
        if (!DateTime.TryParse(parameters.To, out toDate))
        {
            errors.Add("Invalid To date format");
        }
    }
}
