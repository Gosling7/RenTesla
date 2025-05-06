using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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

    public async Task EnsureDatabaseInitializedAsync()
    {
        Console.WriteLine("Applying database migrations...");
        await _dbContext.Database.MigrateAsync();

        bool isSeedingNeeded = 
            !_dbContext.CarModels.Any()
            || !_dbContext.Locations.Any()
            || !_dbContext.Cars.Any()
            || !_dbContext.Users.Any()
            || !_dbContext.Roles.Any();

        if (isSeedingNeeded)
        {
            Console.WriteLine("Seeding required. Starting seeding process...");
            await Seed();
        }
        else
        {
            Console.WriteLine("Database already seeded. Skipping seeding.");
        }
    }

    private async Task Seed()
    {
        Console.WriteLine("Starting seeding database.");

        await SeedRolesAndUsersAsync();

        var carModels = await SeedCarModelsAsync();
        var locations = await SeedLocationsAsync();
        await SeedCarsAsync(carModels, locations);

        Console.WriteLine("Database seeding completed.");
    }

    private async Task SeedRolesAndUsersAsync()
    {
        if (!await _roleManager.RoleExistsAsync(StaffRoleName))
        {
            await _roleManager.CreateAsync(new IdentityRole(StaffRoleName));
        }

        var staffUser = new IdentityUser
        {
            UserName = "smithjohn@rentesla.com",
            Email = "smithjohn@rentesla.com"
        };

        var existingUser = await _userManager.FindByEmailAsync(staffUser.Email);
        if (existingUser == null)
        {
            await _userManager.CreateAsync(staffUser, "Staff123.");
            await _userManager.AddToRoleAsync(staffUser, StaffRoleName);
        }
    }

    private async Task<List<CarModel>> SeedCarModelsAsync()
    {
        var carModels = new List<CarModel>
        {
            new() { Name = "Tesla Model 3", BaseDailyRate = 80 },
            new() { Name = "Tesla Model Y", BaseDailyRate = 90 },
            new() { Name = "Tesla Model S", BaseDailyRate = 100 },
            new() { Name = "Tesla Model X", BaseDailyRate = 100 },
            new() { Name = "Tesla Cybertruck", BaseDailyRate = 120 }
        };
        await _dbContext.CarModels.AddRangeAsync(carModels);
        await _dbContext.SaveChangesAsync();

        return carModels;
    }

    private async Task<List<Location>> SeedLocationsAsync()
    {
        var locations = new List<Location>
        {
            new() { Name = "Palma Airport" },
            new() { Name = "Palma City Center" },
            new() { Name = "Alcudia" },
            new() { Name = "Manacor" }
        };
        await _dbContext.Locations.AddRangeAsync(locations);
        await _dbContext.SaveChangesAsync();

        return locations;
    }

    private async Task SeedCarsAsync(List<CarModel> carModels, List<Location> locations)
    {
        var cars = new List<Car>();
        int licenseCounter = 1;

        foreach (var location in locations)
        {
            foreach (var model in carModels)
            {
                cars.Add(new()
                {
                    LicensePlate = $"TESLA-{licenseCounter++:0000}",
                    ModelId = model.Id,
                    CurrentLocationId = location.Id,
                    Model = model,
                    CurrentLocation = location,
                    Reservations = []
                });
            }
        }

        await _dbContext.Cars.AddRangeAsync(cars);
        await _dbContext.SaveChangesAsync();
    }
}
