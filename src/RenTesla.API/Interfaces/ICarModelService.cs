using RenTesla.API.Data.DTOs;

namespace RenTesla.API.Interfaces;

public interface ICarModelService
{
    Task<IEnumerable<CarModelDto>> GetAvailableCarModelsAsync(string pickupLocationId, DateTime from, DateTime to);
    Task<IEnumerable<CarModelDto>> GetCarModelsAsync();
}