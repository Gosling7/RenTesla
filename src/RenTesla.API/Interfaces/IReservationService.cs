using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Requests;

namespace RenTesla.API.Interfaces;

public interface IReservationService
{
    Task<Result<string>> CreateAsync(ReservationCreateRequest parameters);
    Task<Result<IEnumerable<ReservationDto>>> GetByCodeAndMailAsync(
        string reservationCode, string email);
    Task<Result<IEnumerable<ReservationDto>>> GetByUserAsync(string email);
}