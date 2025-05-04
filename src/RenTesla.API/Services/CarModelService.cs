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

    public async Task<Result<IEnumerable<CarModelDto>>> GetAsync(CarModelQueryRequest request)
    {
        List<string> errors = [];

        var query = _dbContext.CarModels.AsQueryable();

        if (request.Available == true)
        {
            if (!request.PickUpLocationId.HasValue
                || !request.From.HasValue
                || !request.To.HasValue)
            {
                return new Result<IEnumerable<CarModelDto>>(
                    data: [], 
                    errors: ["PickUpLocationId, From and To must be provided when Available=true"]);
            }

            query = query
                .Include(cm => cm.Cars)
                .Where(cm => cm.Cars.Any(c =>
                    c.CurrentLocationId == request.PickUpLocationId
                    && !c.Reservations.Any(r => 
                        request.From < r.To && request.To > r.From)));
        }

        var carModels = await query
            .Select(cm => new CarModelDto(
                cm.Id.ToString(),
                cm.Name,
                cm.BaseDailyRate))
            .ToListAsync();

        return new Result<IEnumerable<CarModelDto>>(data: carModels, errors: errors);
    }
}
