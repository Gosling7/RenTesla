using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Requests;

namespace RenTesla.API.Interfaces;

public interface IReservationService
{
    Task<Result<string>> CreateAsync(ReservationCreateRequest parameters);
    Task<ResultOld<IEnumerable<ReservationDto>>> GetByCodeAndMailAsync(
        string reservationCode, string email);
    Task<ResultOld<IEnumerable<ReservationDto>>> GetByUserAsync(string email);
    Task<Result> ConfirmReturnAsync(string id);
    Task<ResultOld<IEnumerable<ReservationDto>>> GetActiveReservations();
}