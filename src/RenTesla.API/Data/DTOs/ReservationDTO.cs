namespace RenTesla.API.Data.DTOs;

public record ReservationDTO(
    string ReservationCode,
    string CarModelName,
    string PickUpLocationName,
    string DropOffLocationName,
    DateTime From,
    DateTime To,
    decimal TotalCost);