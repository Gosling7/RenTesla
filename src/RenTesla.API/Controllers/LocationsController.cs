using Microsoft.AspNetCore.Mvc;
using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly ILocationService _service;

    public LocationsController(ILocationService locationService)
    {
        _service = locationService;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<LocationDto>>> GetLocations()
    {
        var locations = await _service.GetLocationsAsync();

        return Ok(locations);
    }
}
