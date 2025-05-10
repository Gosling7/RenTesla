using Microsoft.EntityFrameworkCore;
using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Models;
using RenTesla.API.Data.Requests;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Services;

public class CarModelService : ICarModelService
{
    private readonly RenTeslaDbContext _dbContext;

    public CarModelService(RenTeslaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<IEnumerable<CarModelDto>>> GetAsync(
        CarModelQueryRequest request)
    {
        var query = _dbContext.CarModels.AsQueryable();

        if (request.Available == true)
        {
            List<Error> errors = [];

            ValidateRequestParameters(request, errors);

            if (errors.Count > 0)
            {
                return Result<IEnumerable<CarModelDto>>.Failure(errors);
            }

            var locationExists = await _dbContext.Locations
                .AnyAsync(l => l.Id == request.PickUpLocationId);
            if (!locationExists)
            {
                errors.Add(new Error(
                    property: nameof(request.PickUpLocationId),
                    message: "No pickup location found with the given ID.",
                    type: SimpleErrorType.Validation));

                return Result<IEnumerable<CarModelDto>>.Failure(errors);
            }

            query = query
                .Include(cm => cm.Cars)
                .Where(cm => cm.Cars.Any(c =>
                    c.CurrentLocationId == request.PickUpLocationId
                    && !c.Reservations.Any(r =>
                        request.From < r.To
                        && request.To > r.From
                        && r.Status != ReservationStatus.Completed)));

            var availableCarModels = await query
                .Select(cm => new CarModelDto(
                    cm.Id.ToString(),
                    cm.Name,
                    cm.BaseDailyRate,
                    CalculateRentalCost(request.From, request.To, cm.BaseDailyRate)))
                .ToListAsync();

            return Result<IEnumerable<CarModelDto>>.Success(availableCarModels);
        }

        var allCarModels = await query
            .Select(cm => new CarModelDto(
                cm.Id.ToString(),
                cm.Name,
                cm.BaseDailyRate,
                0))
            .ToListAsync();

        return Result<IEnumerable<CarModelDto>>.Success(allCarModels);
    }

    private static void ValidateRequestParameters(CarModelQueryRequest request, 
        List<Error> errors)
    {
        if (!request.PickUpLocationId.HasValue)
        {
            errors.Add(new Error(
                property: nameof(request.PickUpLocationId),
                message: "'PickUpLocationId' must be provided when Available=true.",
                type: SimpleErrorType.Validation));
        }
        if (!request.From.HasValue)
        {
            errors.Add(new Error(
                property: nameof(request.From),
                message: "'From' must be provided when Available=true.",
                type: SimpleErrorType.Validation));
        }
        if (!request.To.HasValue)
        {
            errors.Add(new Error(
                property: nameof(request.To),
                message: "'To' must be provided when Available=true.",
                type: SimpleErrorType.Validation));
        }
    }

    private static decimal CalculateRentalCost(DateTime? from, DateTime? to, decimal dailyRate)
    {
        var hourlyRate = dailyRate / 10;
        var totalHours = (decimal)(to - from)?.TotalHours!;

        // Round up to the next full hour to ensure full hour billing
        var billedHours = Math.Ceiling(totalHours);

        // Determine full days and leftover hours
        var fullDays = (int)(billedHours / 24);
        var remainingHours = billedHours % 24;

        // Cap the remaining hourly cost at the daily rate
        var remainingCost = Math.Min(remainingHours * hourlyRate, dailyRate);

        return (fullDays * dailyRate) + remainingCost;
    }
}
