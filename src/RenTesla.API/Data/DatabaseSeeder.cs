using RenTesla.API.Data.Models;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Data;

public class DatabaseSeeder : IDatabaseSeeder
{
    private readonly RenTeslaDbContext _dbContext;

    public DatabaseSeeder(RenTeslaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Seed()
    {
        Console.WriteLine("Starting seeding database.");

        var carModels = new List<CarModel>()
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Tesla 1",
                BaseDailyRate = 100
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Tesla 2",
                BaseDailyRate = 120
            }
        };
        await _dbContext.CarModels.AddRangeAsync(carModels);

        await _dbContext.SaveChangesAsync();

        Console.WriteLine("Database seeding completed.");
    }
}
