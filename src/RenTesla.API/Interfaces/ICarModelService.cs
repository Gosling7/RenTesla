using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Requests;

namespace RenTesla.API.Interfaces;

public interface ICarModelService
{
    Task<IEnumerable<CarModelDto>> GetAsync(CarModelQueryRequest query);
}