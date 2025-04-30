using RenTesla.API.Data.DTOs;

namespace RenTesla.API.Interfaces;

public interface IReservationService
{
    Task<string> CreateReservationAsync(CreateReservationParameters parameters);
    Task<ReservationDTO> GetReservationByCodeAsync(string reservationCode);
}