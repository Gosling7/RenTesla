namespace RenTesla.API.Data.Requests;

public class CarModelQueryRequest
{
    public bool? Available { get; set; }
    public Guid? PickUpLocationId { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
}
