using Microsoft.EntityFrameworkCore;
using RenTesla.API.Data.Models;

namespace RenTesla.API.Data;

public class RenTeslaDbContext : DbContext
{
    public RenTeslaDbContext(DbContextOptions<RenTeslaDbContext> options) : base(options)
    {        
    }

    public DbSet<Car> Cars { get; set; }
    public DbSet<CarModel> CarModels { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<Reservation> Reservations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Car>(carEntity =>
        {
            carEntity.HasOne(c => c.Model)
                .WithMany(cm => cm.Cars)
                .HasForeignKey(c => c.ModelId);

            carEntity.HasOne(c => c.CurrentLocation)
                .WithMany(l => l.Cars)
                .HasForeignKey(c => c.CurrentLocationId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Reservation>(reservationEntity =>
        {
            reservationEntity.HasOne(r => r.Car)
                .WithMany(c => c.Reservations)
                .HasForeignKey(r => r.CarId);

            reservationEntity.HasOne(r => r.PickUpLocation)
                .WithMany(l => l.PickUpReservations)
                .HasForeignKey(r => r.PickUpLocationId)
                .OnDelete(DeleteBehavior.Restrict);

            reservationEntity.HasOne(r => r.DropOffLocation)
                .WithMany(l => l.DropOffReservations)
                .HasForeignKey(r => r.DropOffLocationId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        //modelBuilder.Entity<CarModel>()
        //    .HasMany(cm => cm.Cars)
        //    .WithOne(c => c.Model)
        //    .HasForeignKey(c => c.ModelId);

        //modelBuilder.Entity<Location>()
        //    .HasMany(cm => cm.Cars)
        //    .WithOne(c => c.loca)
        //    .HasForeignKey(c => c.ModelId);
    }
}
