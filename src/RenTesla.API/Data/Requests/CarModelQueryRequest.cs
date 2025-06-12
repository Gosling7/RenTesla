namespace RenTesla.API.Data.Requests;

public record CarModelQueryRequest(
    bool? Available,
    Guid? PickUpLocationId,
    Guid? DropOffLocationId,
    DateTime? From,
    DateTime? To);
