using Microsoft.AspNetCore.Mvc;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReservationsController : ControllerBase
{
    private readonly IReservationService _reservationService;

    public ReservationsController(IReservationService reservationService)
    {
        _reservationService = reservationService;
    }

    [HttpPost("")]
    public async Task<ActionResult<string>> CreateReservation(
        [FromBody] CreateReservationParameters parameters)
    {
        var reservationCode = await _reservationService.CreateReservationAsync(parameters);

        return Ok(reservationCode);
    }

    [HttpGet("{reservationCode}")]
    public async Task<ActionResult<ReservationDTO>> GetReservation(string reservationCode)
    {
        return Ok(await _reservationService.GetReservationByCodeAsync(reservationCode));
    }
}
