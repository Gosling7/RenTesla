using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Requests;
using RenTesla.API.Helpers;
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
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<string>> Create(
        [FromBody] ReservationCreateRequest request)
    {
        var result = await _service.CreateAsync(request);
        if (result.IsValidationError)
        {
            var problemDetails = ProblemDetailsHelper.SimpleCreateValidationProblemDetails(
                HttpContext, result.Errors);

            return BadRequest(problemDetails);
        }

        return Ok(result.Value);
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ReservationDto>> GetByReservationCode(
        [FromQuery] ReservationByCodeQueryRequest request)
    {
        var result = await _service.GetByCodeAndMailAsync(request);
        if (result.IsValidationError)
        {
            var problemDetails = ProblemDetailsHelper.SimpleCreateValidationProblemDetails(
                HttpContext, result.Errors);

            return BadRequest(problemDetails);
        }

        return Ok(result.Value);
    }

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<ReservationDto>>> GetByUser()
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var result = await _service.GetByUserAsync(email);
        if (result.IsValidationError)
        {
            var problemDetails = ProblemDetailsHelper.SimpleCreateValidationProblemDetails(
                HttpContext, result.Errors);

            return BadRequest(problemDetails);
        }

        return Ok(result.Value);
    }

    [Authorize]
    [HttpPost("{id}/confirm-return")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ConfirmReturn(Guid id)
    {
        var result = await _service.ConfirmReturnAsync(id, HttpContext);
        if (result.IsNotFoundError)
        {
            var problemDetails = ProblemDetailsHelper.SimpleCreateNotFoundProblemDetails(
                HttpContext, result.Errors.First().Message);

            return NotFound(problemDetails);
        }
        if (result.IsValidationError)
        {
            var problemDetails = ProblemDetailsHelper.SimpleCreateValidationProblemDetails(
                HttpContext, result.Errors);

            return BadRequest(problemDetails);
        }

        return Ok();
    }

    [Authorize(Roles = "Staff")]
    [HttpGet("pending-return")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status405MethodNotAllowed)]
    public async Task<IActionResult> GetActiveReservations()
    {
        var reservations = await _service.GetActiveReservations();

        return Ok(reservations);
    }
}
