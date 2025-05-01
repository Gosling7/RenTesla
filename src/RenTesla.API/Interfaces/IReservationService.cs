using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Data.Parameters;

namespace RenTesla.API.Interfaces;

public interface IReservationService
{
    Task<string> CreateReservationAsync(CreateReservationParameter parameters);
    Task<Result<ReservationDto>> GetReservationByCodeAndMailAsync(string reservationCode, string email);
    Task<IReadOnlyCollection<ReservationDto>> GetUserReservationsAsync(string email);
}