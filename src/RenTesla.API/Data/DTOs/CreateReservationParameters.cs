namespace RenTesla.API.Data.DTOs;

public record CreateReservationParameters(
    string CarModelId,
    string PickUpLocationId,
    string DropOffLocationId,
    DateTime from,
    DateTime to);
