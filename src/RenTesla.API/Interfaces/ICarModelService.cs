using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Requests;

namespace RenTesla.API.Interfaces;

public interface ICarModelService
{
    //Task<Result<IEnumerable<CarModelDto>>> GetAsync(CarModelQueryRequest query);
    Task<Result<IEnumerable<CarModelDto>>> GetAsync(CarModelQueryRequest request);
}