using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Requests;

namespace RenTesla.API.Interfaces;

public interface IReservationService
{
    Task<Result<string>> CreateAsync(ReservationCreateRequest parameters);
    Task<Result<ReservationDto>> GetByCodeAndMailAsync(
        ReservationByCodeQueryRequest request);
    Task<Result<IEnumerable<ReservationDto>>> GetByUserAsync(string email);
    Task<SimpleResult> ConfirmReturnAsync(Guid id, HttpContext httpContext);
    Task<IEnumerable<ReservationDto>> GetActiveReservations();
}