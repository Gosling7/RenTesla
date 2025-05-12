namespace RenTesla.API.Data.Requests;

public record ReservationCreateRequest(
    bool? CreateAccount,
    string? Password,
    string Email,
    Guid CarModelId,
    Guid PickUpLocationId,
    Guid DropOffLocationId,
    DateTime From,
    DateTime To,
    decimal TotalCost);
