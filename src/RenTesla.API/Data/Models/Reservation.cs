namespace RenTesla.API.Data.Models;

public class Reservation
{
    public Guid Id { get; set; }

    public bool UserConfirmedReturn { get; set; }
    public bool StaffConfirmedReturn { get; set; }
    public ReservationStatus Status { get; set; }
    public DateTime? ReturnConfirmedDate { get; set; }

    public string ReservationCode { get; set; }
    public string Email { get; set; }

    public Guid CarId { get; set; }
    public Guid PickUpLocationId { get; set; }
    public Guid DropOffLocationId { get; set; }

    public DateTime From { get; set; }
    public DateTime To { get; set; }

    public decimal DailyRate { get; set; }
    public decimal TotalCost => (decimal)(To.Date - From.Date).TotalDays * DailyRate;

    public Car Car { get; set; } = null!;
    public Location PickUpLocation { get; set; } = null!;
    public Location DropOffLocation { get; set; } = null!;

    public Reservation()
    {
        ReservationCode = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
    }
}
