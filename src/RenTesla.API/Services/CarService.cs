using Microsoft.EntityFrameworkCore;
using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Services;

public class CarService : ICarService
{
    private readonly RenTeslaDbContext _dbContext;

    public CarService(RenTeslaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    //public async Task<IEnumerable<CarModelDTO>> GetAvailableCarsAsync()
    //{

    //}

    public async Task<IEnumerable<CarModelDTO>> GetCarModelsAsync()
    {
        var carModels = await _dbContext.CarModels.ToListAsync();
        return carModels.Select(cm => new CarModelDTO(
            Id: cm.Id.ToString(),
            Name: cm.Name,
            BaseDailyRate: cm.BaseDailyRate));
    }
}
