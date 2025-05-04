using Microsoft.AspNetCore.Identity;
using RenTesla.API.Data.Models;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Data;

public class DatabaseSeeder : IDatabaseSeeder
{
    private readonly RenTeslaDbContext _dbContext;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<IdentityUser> _userManager;
    private const string StaffRoleName = "Staff";

    public DatabaseSeeder(RenTeslaDbContext dbContext, 
        RoleManager<IdentityRole> roleManager, 
        UserManager<IdentityUser> userManager)
    {
        _dbContext = dbContext;
        _roleManager = roleManager;
        _userManager = userManager;
    }

    public async Task Seed()
    {
        Console.WriteLine("Starting seeding database.");

        await _roleManager.CreateAsync(new IdentityRole(StaffRoleName));
        
        var staffUser = new IdentityUser
        {
            UserName = "smithjohn@rentesla.com",
            Email = "smithjohn@rentesla.com"
        };

        await _userManager.CreateAsync(user: staffUser, password: "Staff123!");
        await _userManager.AddToRoleAsync(user: staffUser, role: StaffRoleName);

        var modelSId = Guid.NewGuid();
        var modelXId = Guid.NewGuid();

        var carTeslaModelS = new CarModel
        {
            Id = modelSId,
            Name = "Tesla Model S",
            BaseDailyRate = 100
        };
        var carTeslaModelX = new CarModel
        {
            Id = modelXId,
            Name = "Tesla Model X",
            BaseDailyRate = 100
        };
        var carModels = new List<CarModel>
        {
            carTeslaModelS,
            carTeslaModelX,
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Tesla Model 3",
                BaseDailyRate = 120
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Tesla Model Y",
                BaseDailyRate = 120
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Tesla Cybertruck",
                BaseDailyRate = 120
            }
        };
        await _dbContext.CarModels.AddRangeAsync(carModels);

        var palmaAirportLocation = new Location
        {
            Id = Guid.NewGuid(),
            Name = "Palma Airport"
        };
        var locations = new List<Location>()
        {
            palmaAirportLocation,
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Palma City Center"
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Alcudia"
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Manacor"
            },
        };
        await _dbContext.Locations.AddRangeAsync(locations);

        var cars = new List<Car>()
        {
            new()
            {
                Id = Guid.NewGuid(),
                LicensePlate = "License Plate Number 1",
                ModelId = carTeslaModelS.Id,
                CurrentLocationId = palmaAirportLocation.Id,
                Model = carTeslaModelS,
                CurrentLocation = palmaAirportLocation,
                Reservations = []
            },
            new()
            {
                Id = Guid.NewGuid(),
                LicensePlate = "License Plate Number 2",
                ModelId = carTeslaModelX.Id,
                CurrentLocationId = palmaAirportLocation.Id,
                Model = carTeslaModelX,
                CurrentLocation = palmaAirportLocation,
                Reservations = []
            }
        };
        await _dbContext.Cars.AddRangeAsync(cars);

        await _dbContext.SaveChangesAsync();

        Console.WriteLine("Database seeding completed.");
    }
}
