using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RenTesla.API.Data;
using RenTesla.API.Interfaces;
using RenTesla.API.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<RenTeslaDbContext>(optionsBuilder =>
{
    optionsBuilder.UseSqlServer(
        $"Data Source=localhost,1433;" +
        $"Initial Catalog=RenTesla;" +
        "User ID=sa;" +
        $"Password=Password1!;" +
        "Encrypt=False;" +
        "Trust Server Certificate=True");
});

//builder.Services.AddAuthorization();

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<RenTeslaDbContext>();

//builder.Services.AddIdentityApiEndpoints<IdentityUser>()
//    .AddEntityFrameworkStores<RenTeslaDbContext>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/api/auth/login";
    options.LogoutPath = "/api/auth/logout";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

builder.Services
    .AddScoped<ILocationService, LocationService>()
    .AddScoped<ICarModelService, CarModelService>()
    .AddScoped<IReservationService, ReservationService>()
    .AddScoped<IDatabaseSeeder, DatabaseSeeder>();

const string CorsOrigin = "MyCorsOrigin";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CorsOrigin,
        builder =>
        {
            builder.WithOrigins("http://localhost:3000");
        });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<RenTeslaDbContext>();
    await dbContext.Database.MigrateAsync();
    if (!dbContext.CarModels.Any())
    {
        var databaseSeeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();
        await databaseSeeder.Seed();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors(CorsOrigin);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
