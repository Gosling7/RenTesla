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
    public async Task<ActionResult<ResultOld<string>>> Create(
        [FromBody] ReservationCreateRequest request)
    {
        var result = await _service.CreateAsync(request);
        if (!result.IsSuccess)
        {
            var problemDetails = ProblemDetailsHelper.CreateValidationProblemDetails(
                HttpContext, result.Errors);

            return BadRequest(problemDetails);
        }

        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<ResultOld<IEnumerable<ReservationDto>>>> Get(
        [FromQuery] ReservationByCodeQueryRequest request)
    {
        var result = await _service.GetByCodeAndMailAsync(request);
        if (!result.IsSuccess)
        {
            var problemDetails = ProblemDetailsHelper.CreateValidationProblemDetails(
                HttpContext, result.Errors);

            return BadRequest(problemDetails);
        }

        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<Result<IEnumerable<ReservationDto>>>> GetByUser()
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        // TODO: cos z tym zrobic
        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new ResultOld<IEnumerable<ReservationDto>>(
                data: [],
                errors: ["Email is missing"]));
        }

        var result = await _service.GetByUserAsync(email);
        if (!result.IsSuccess)
        {
            var problemDetails = ProblemDetailsHelper.CreateValidationProblemDetails(
                HttpContext, result.Errors);

            return BadRequest(problemDetails);
        }

        return Ok(result);
    }

    [Authorize]
    [HttpPost("{id}/confirm-return")]
    public async Task<ActionResult<Result<string>>> ConfirmReturnByUser(string id)
    {
        var result = await _service.ConfirmReturnAsync(id, HttpContext);
        if (result.ErrorType == ErrorType.NotFound)
        {
            var problemDetails = ProblemDetailsHelper.CreateNotFoundProblemDetails(
                HttpContext, "Reservation not found.");

            return NotFound(problemDetails);
        }

        if (!result.IsSuccess)
        {
            var problemDetails = ProblemDetailsHelper.CreateValidationProblemDetails(
                HttpContext, result.Errors);

            return BadRequest(problemDetails);
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
