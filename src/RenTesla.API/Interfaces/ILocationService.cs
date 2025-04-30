using RenTesla.API.Data.DTOs;

namespace RenTesla.API.Interfaces;

public interface ILocationService
{
    Task<IEnumerable<LocationDTO>> GetLocationsAsync();
}