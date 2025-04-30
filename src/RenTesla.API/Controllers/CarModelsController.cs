using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Models;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Controllers
{
    [Route("api/car-models")]
    [ApiController]
    public class CarModelsController : ControllerBase
    {
        private readonly ICarModelService _carModelService;

        public CarModelsController(ICarModelService carModelService)
        {
            _carModelService = carModelService;
        }

        [HttpGet("")]
        public async Task<ActionResult<IEnumerable<CarModelDTO>>> GetCarModels()
        {
            var carModels = await _carModelService.GetCarModelsAsync();
            return Ok(carModels);
        }

        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<CarModelDTO>>> GetAvailableCarModels(
            [FromQuery] string pickupLocationId, DateTime from, DateTime to)
        {
            var availableCarModels = await _carModelService.GetAvailableCarModelsAsync(
                pickupLocationId: pickupLocationId, from: from, to: to);

            return Ok(availableCarModels);
        }
    }
}
