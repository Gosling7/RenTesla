using Microsoft.EntityFrameworkCore;
using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
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

    public async Task<IEnumerable<CarModelDto>> GetAsync(CarModelQueryRequest query)
    {
        var carModels = _dbContext.CarModels.AsQueryable();

        if (query.Available == true)
        {
            if (!query.PickUpLocationId.HasValue
                || !query.From.HasValue
                || !query.To.HasValue)
            {
                throw new ArgumentException("PickUpLocationId, From and To must be provided when Available=true.");
            }

            carModels = carModels
                .Where(cm => cm.Cars.Any(c =>
                    c.CurrentLocationId == query.PickUpLocationId
                    && !c.Reservations.Any(r => 
                        query.From < r.To && query.To > r.From)));
        }

        return await carModels
            .Select(cm => new CarModelDto(
                cm.Id.ToString(),
                cm.Name,
                cm.BaseDailyRate))
            .ToListAsync();
    }

    //public async Task<IEnumerable<CarModelDto>> GetAvailableAsync(
    //    AvailableCarModelsRequest parameters)
    //{
    //    var locationId = Guid.Parse(parameters.PickUpLocationId);

    //    return await _dbContext.Cars
    //        .Where(c => c.CurrentLocationId == locationId && c.IsAvailable)
    //        .Where(c => !c.Reservations.Any(r =>
    //            parameters.From < r.To && parameters.To > r.From))
    //        .GroupBy(c => c.Model)
    //        .Select(groupByCarModel => new CarModelDto(
    //            groupByCarModel.Key.Id.ToString(),
    //            groupByCarModel.Key.Name,
    //            groupByCarModel.Key.BaseDailyRate))
    //        .ToListAsync();
    //}
}
