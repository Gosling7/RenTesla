using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Requests;

namespace RenTesla.API.Interfaces;

public interface IReservationService
{
    Task<Result<string>> CreateReservationAsync(ReservationCreateRequest parameters);
    Task<Result<IEnumerable<ReservationDto>>> GetReservationByCodeAndMailAsync(
        string reservationCode, string email);
    Task<Result<IEnumerable<ReservationDto>>> GetUserReservationsAsync(string email);
}