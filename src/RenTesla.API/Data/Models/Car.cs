namespace RenTesla.API.Data.Models;

public class Car
{
    public Guid Id { get; set; }
    public string LicensePlate { get; set; } = string.Empty;

    public Guid ModelId { get; set; }
    public Guid CurrentLocationId { get; set; }

    public CarModel Model { get; set; } = null!;
    public Location CurrentLocation { get; set; } = null!;
    public ICollection<Reservation> Reservations { get; set; } = [];
}
