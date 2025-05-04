namespace RenTesla.API.Data.Requests;

public record CarModelQueryRequest(
    bool? Available,
    Guid? PickUpLocationId,
    DateTime? From,
    DateTime? To);
