namespace RenTesla.API.Data.Models;

public class CarModel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal BaseDailyRate { get; set; }

    public ICollection<Car> Cars { get; set; } = [];
}
