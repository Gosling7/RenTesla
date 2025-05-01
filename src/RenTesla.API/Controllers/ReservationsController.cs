using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Parameters;
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
        [FromBody] CreateReservationParameter parameters)
    {
        var reservationCode = await _reservationService.CreateReservationAsync(parameters);

        return Ok(reservationCode);
    }

    [HttpGet("{email}/{reservationCode}")]
    public async Task<ActionResult<Result<ReservationDto>>> GetReservation(
        string reservationCode, string email)
    {
        var result = await _reservationService.GetReservationByCodeAndMailAsync(
            reservationCode, email);
        
        if (!result.Data.Any())
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [Authorize]
    [HttpGet("{email}")]
    public async Task<ActionResult<IEnumerable<ReservationDto>>> GetUserReservations(string email)
    {
        return Ok(await _reservationService.GetUserReservationsAsync(email));
    }
}
