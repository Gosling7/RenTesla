using Microsoft.AspNetCore.Mvc;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly ILocationService _locationService;

    public LocationsController(ILocationService locationService)
    {
        _locationService = locationService;
    }

    [HttpGet("")]
    public async Task<ActionResult<IEnumerable<LocationDto>>> GetLocations()
    {
        var locations = await _locationService.GetLocationsAsync();

        return Ok(locations);
    }
}
