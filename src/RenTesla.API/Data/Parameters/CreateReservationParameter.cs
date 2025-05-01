namespace RenTesla.API.Data.Parameters;

public record CreateReservationParameter(
    string Email,
    string CarModelId,
    string PickUpLocationId,
    string DropOffLocationId,
    DateTime from,
    DateTime to);
