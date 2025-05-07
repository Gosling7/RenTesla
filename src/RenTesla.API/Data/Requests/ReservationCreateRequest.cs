namespace RenTesla.API.Data.Requests;

public record ReservationCreateRequest(
    string Email,
    string CarModelId,
    string PickUpLocationId,
    string DropOffLocationId,
    string From,
    string To,
    decimal TotalCost);
