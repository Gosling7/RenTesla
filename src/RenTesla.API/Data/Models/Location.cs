namespace RenTesla.API.Data.Models;

public class Location
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<Car> Cars { get; set; } = [];
    public ICollection<Reservation> PickUpReservations { get; set; } = [];
    public ICollection<Reservation> DropOffReservations { get; set; } = [];
}
