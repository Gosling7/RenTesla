namespace RenTesla.API.Data.DTOs;

public record ReservationDto(
    string ReservationCode,
    string CarModelName,
    string PickUpLocationName,
    string DropOffLocationName,
    DateTime From,
    DateTime To,
    decimal TotalCost);