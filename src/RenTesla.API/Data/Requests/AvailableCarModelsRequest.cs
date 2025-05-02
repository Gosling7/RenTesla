namespace RenTesla.API.Data.Requests;

public record AvailableCarModelsRequest(
    string PickUpLocationId,
    DateTime From,
    DateTime To);
