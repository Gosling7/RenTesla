using RenTesla.API.Data.DTOs;

namespace RenTesla.API.Interfaces;

public interface ICarModelService
{
    Task<IEnumerable<CarModelDTO>> GetAvailableCarModelsAsync(string pickupLocationId, DateTime from, DateTime to);
    Task<IEnumerable<CarModelDTO>> GetCarModelsAsync();
}