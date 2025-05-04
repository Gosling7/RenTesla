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
    private readonly IReservationService _service;

    public ReservationsController(IReservationService reservationService)
    {
        _service = reservationService;
    }

    [HttpPost]
    public async Task<ActionResult<Result<string>>> Create(
        [FromBody] ReservationCreateRequest request)
    {
        var result = await _service.CreateAsync(request);
        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<Result<IEnumerable<ReservationDto>>>> Get(
        [FromQuery] string reservationCode, string email)
    {
        var result = await _service.GetByCodeAndMailAsync(
            reservationCode: reservationCode, email: email);
        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<Result<IEnumerable<ReservationDto>>>> GetByUser()
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new Result<IEnumerable<ReservationDto>>(
                data: [],
                errors: ["Email is missing"]));
        }

        var result = await _service.GetByUserAsync(email);
        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize]
    [HttpPost("{id}/confirm-return")]
    public async Task<ActionResult<Result>> ConfirmReturnByUser(string id)
    {
        var result = await _service.ConfirmReturnAsync(id);
        if (!result.IsSuccess)
        {
            BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize(Roles = "Staff")]
    [HttpGet("pending-return")]
    public async Task<IActionResult> GetActiveReservations()
    {
        var result = await _service.GetActiveReservations();

        return Ok(result);
    }
}
