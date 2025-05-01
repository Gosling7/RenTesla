using Microsoft.EntityFrameworkCore;
using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Models;
using RenTesla.API.Data.Parameters;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Services;

public class ReservationService : IReservationService
{
    private readonly RenTeslaDbContext _dbContext;
    private readonly DateTime _utcNow = DateTime.UtcNow;

    public ReservationService(RenTeslaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<ReservationDto>> GetReservationByCodeAndMailAsync(string reservationCode, string email)
    {
        var reservation = await _dbContext.Reservations
            .Include(r => r.Car)
            .ThenInclude(c => c.Model)
            .Include(r => r.PickUpLocation)
            .Include(r => r.DropOffLocation)
            .Where(r => r.ReservationCode == reservationCode && r.Email == email)
            .Where(r => r.To > _utcNow)
            .FirstOrDefaultAsync();

        if (reservation is null)
        {
            return new Result<ReservationDto>(
                Data: [],
                Errors: []);
        }

        return new Result<ReservationDto>(
            Data: [ new ReservationDto(
                ReservationCode: reservationCode,
                CarModelName: reservation.Car.Model.Name,
                PickUpLocationName: reservation.PickUpLocation.Name,
                DropOffLocationName: reservation.DropOffLocation.Name,
                From: reservation.From,
                To: reservation.To,
                TotalCost: reservation.TotalCost) ],
            Errors: []);
    }

    public async Task<IReadOnlyCollection<ReservationDto>> GetUserReservationsAsync(string email)
    {
        return await _dbContext.Reservations
            .Include(r => r.Car)
            .ThenInclude(c => c.Model)
            .Include(r => r.PickUpLocation)
            .Include(r => r.DropOffLocation)
            .Where(r => r.Email == email)
            .Select(r => new ReservationDto(
                r.ReservationCode,
                r.Car.Model.Name,
                r.PickUpLocation.Name,
                r.DropOffLocation.Name,
                r.From,
                r.To,
                r.TotalCost))
            .ToListAsync();

        //return new ReservationDto(
        //    ReservationCode: reservation.ReservationCode,
        //    CarModelName: reservation.Car.Model.Name,
        //    PickUpLocationName: reservation.PickUpLocation.Name,
        //    DropOffLocationName: reservation.DropOffLocation.Name,
        //    From: reservation.From,
        //    To: reservation.To,
        //    TotalCost: reservation.TotalCost);
    }

    public async Task<string> CreateReservationAsync(
        CreateReservationParameter parameters)
    {
        // TODO: validate email

        var availableCarModel = await _dbContext.CarModels
            .Where(cm => cm.Id.ToString() == parameters.CarModelId)
            .FirstOrDefaultAsync();

        var availableCar = await _dbContext.Cars
            .Where(c => c.ModelId.ToString() == parameters.CarModelId && c.IsAvailable)
            .FirstOrDefaultAsync();
        if (availableCar is null)
        {
            // return - no available car
        }

        var existingPickUpLocation = await _dbContext.Locations
            .Where(l => l.Id.ToString() == parameters.PickUpLocationId)
            .FirstOrDefaultAsync();
        var existingDropOffLocation = await _dbContext.Locations
            .Where(l => l.Id.ToString() == parameters.DropOffLocationId)
            .FirstOrDefaultAsync();
        if (existingPickUpLocation is null || existingDropOffLocation is null)
        {
            // no location
        }

        var reservation = new Reservation
        {
            Id = Guid.NewGuid(),
            Email = parameters.Email,
            CarId = availableCar.Id,
            PickUpLocationId = existingPickUpLocation.Id,
            DropOffLocationId = existingDropOffLocation.Id,
            From = parameters.from,
            To = parameters.to,
            DailyRate = availableCarModel.BaseDailyRate,
            Car = availableCar,
            PickUpLocation = existingPickUpLocation,
            DropOffLocation = existingDropOffLocation
        };

        // change the car .isAvailable to false

        await _dbContext.Reservations.AddAsync(reservation);

        await _dbContext.SaveChangesAsync();

        return reservation.ReservationCode;
    }
}
