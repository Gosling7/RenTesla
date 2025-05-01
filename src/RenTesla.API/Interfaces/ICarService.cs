using RenTesla.API.Data.DTOs;

namespace RenTesla.API.Interfaces;

public interface ICarService
{
    Task<IEnumerable<CarModelDto>> GetCarModelsAsync();
}