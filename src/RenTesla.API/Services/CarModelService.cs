using Microsoft.EntityFrameworkCore;
using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Services;

public class CarModelService : ICarModelService
{
    private readonly RenTeslaDbContext _dbContext;

    public CarModelService(RenTeslaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<CarModelDto>> GetCarModelsAsync()
    {
        return await _dbContext.CarModels
            .Select(cm => new CarModelDto(
                cm.Id.ToString(),
                cm.Name,
                cm.BaseDailyRate))
            .ToListAsync();
    }

    public async Task<IEnumerable<CarModelDto>> GetAvailableCarModelsAsync(
        string pickupLocationId, DateTime from, DateTime to)
    {
        if (!Guid.TryParse(pickupLocationId, out var locatonGuid))
        {
            // invalid guid
        }

        //var x = await _dbContext.Cars
        //    .Include(c => c.Model)
        //    .Include(c => c.CurrentLocation)
        //    .Where(c => c.CurrentLocationId == locatonGuid && c.IsAvailable)
        //    .Where(c => !c.Reservations.Any(r =>
        //        from < r.To && to > r.From))
        //    .ToListAsync();

        //var y = x.GroupBy(c => c.Model)
        //    .Select(groupByCarModel => new CarModelDTO(
        //        groupByCarModel.Key.Id.ToString(),
        //        groupByCarModel.Key.Name,
        //        groupByCarModel.Key.BaseDailyRate))
        //    .ToList();

        return await _dbContext.Cars
            .Where(c => c.CurrentLocationId == locatonGuid && c.IsAvailable)
            .Where(c => !c.Reservations.Any(r =>
                from < r.To && to > r.From))
            .GroupBy(c => c.Model)
            .Select(groupByCarModel => new CarModelDto(
                groupByCarModel.Key.Id.ToString(),
                groupByCarModel.Key.Name,
                groupByCarModel.Key.BaseDailyRate))
            .ToListAsync();
    }
}
