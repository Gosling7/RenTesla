using Microsoft.EntityFrameworkCore;
using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Models;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Services;

public class ReservationService : IReservationService
{
    private readonly RenTeslaDbContext _dbContext;

    public ReservationService(RenTeslaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ReservationDTO> GetReservationByCodeAsync(string reservationCode)
    {
        // dodac Include'y
        var reservation = await _dbContext.Reservations
            .Include(r => r.Car)
            .ThenInclude(c => c.Model)
            .Include(r => r.PickUpLocation)
            .Include(r => r.DropOffLocation)
            .Where(r => r.ReservationCode == reservationCode)
            .FirstOrDefaultAsync();

        return new ReservationDTO(
            ReservationCode: reservationCode,
            CarModelName: reservation.Car.Model.Name,
            PickUpLocationName: reservation.PickUpLocation.Name,
            DropOffLocationName: reservation.DropOffLocation.Name,
            From: reservation.From,
            To: reservation.To,
            TotalCost: reservation.TotalCost);
    }

    public async Task<string> CreateReservationAsync(
        CreateReservationParameters parameters)
    {
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
