using Microsoft.AspNetCore.Mvc;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarsController : ControllerBase
{
    private readonly ICarService _carService;

    public CarsController(ICarService carService)
    {
        _carService = carService;
    }

    [HttpGet("")]
    public ActionResult<IEnumerable<string>> GetAvailableCars()
    {
        var cars = new List<string>() { "onecar", "two car" };

        return Ok(cars);
    }

    [HttpGet("{id}")]
    public ActionResult<string> GetCarById(string id)
    {
        var message = $"I've returned: {id}";

        return Ok(message);
    }

    [HttpGet("Models")]
    public async Task<ActionResult<IEnumerable<CarModelDTO>>> GetCarModels()
    {
        return Ok(await _carService.GetCarModelsAsync());
    }
}
