using Microsoft.AspNetCore.Mvc;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Requests;
using RenTesla.API.Helpers;
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
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<CarModelDto>>> GetAsync(
        [FromQuery] CarModelQueryRequest query)
    {
        var result = await _service.GetAsync(query);

        if (result.IsValidationError)
        {
            var problemDetails = ProblemDetailsHelper.SimpleCreateValidationProblemDetails(
                HttpContext, result.Errors);

            return BadRequest(problemDetails);
        }

        return Ok(result.Value);
    }
}
