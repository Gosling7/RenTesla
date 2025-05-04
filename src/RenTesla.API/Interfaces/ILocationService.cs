using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;

namespace RenTesla.API.Interfaces;

public interface ILocationService
{
    Task<Result<IEnumerable<LocationDto>>> GetLocationsAsync();
}