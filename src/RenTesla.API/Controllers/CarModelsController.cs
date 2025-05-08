using Microsoft.AspNetCore.Mvc;
using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Requests;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Controllers;

[Route("api/car-models")]
[ApiController]
public class CarModelsController : ControllerBase
{
    private readonly ICarModelService _service;

    public CarModelsController(ICarModelService carModelService)
    {
        _service = carModelService;
    }

    [HttpGet]
    public async Task<ActionResult<ResultOld<IEnumerable<CarModelDto>>>> GetAsync(
        [FromQuery] CarModelQueryRequest query)
    {
        return Ok(await _service.GetAsync(query));
    }
}
