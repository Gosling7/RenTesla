using RenTesla.API.Data.Models;

namespace RenTesla.API.Data.DTOs;

public record ReservationDto(
    string Id,
    string ReservationCode,
    string CarModelName,
    string PickUpLocationName,
    string DropOffLocationName,
    DateTime From,
    DateTime To,
    ReservationStatus Status,
    decimal TotalCost);