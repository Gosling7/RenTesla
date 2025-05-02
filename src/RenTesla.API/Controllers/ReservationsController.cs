using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Requests;
using RenTesla.API.Interfaces;
using System.Security.Claims;

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

    [HttpPost]
    public async Task<ActionResult<Result<string>>> CreateReservation(
        [FromBody] ReservationCreateRequest request)
    {
        var result = await _reservationService.CreateReservationAsync(request);
        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<Result<IEnumerable<ReservationDto>>>> GetReservation(
        [FromQuery] string reservationCode, string email)
    {
        var result = await _reservationService.GetReservationByCodeAndMailAsync(
            reservationCode, email);        
        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<Result<IEnumerable<ReservationDto>>>> GetUserReservations()
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new Result<IEnumerable<ReservationDto>>(
                data: [], 
                errors: ["Email is missing"]));
        }

        var result = await _reservationService.GetUserReservationsAsync(email);
        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
