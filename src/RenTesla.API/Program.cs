using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RenTesla.API.Data;
using RenTesla.API.Interfaces;
using RenTesla.API.Services;
using RenTesla.API.Validators;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddOpenApi();

builder.Services.AddDbContext<RenTeslaDbContext>(optionsBuilder =>
{
    var dbHost = builder.Configuration["DB_Host"];
    if (string.IsNullOrWhiteSpace(dbHost))
    {
        dbHost = "localhost";
    }

    optionsBuilder.UseSqlServer(
        $"Data Source={dbHost},1433;" +
        "Initial Catalog=RenTesla;" +
        "User ID=sa;" +
        "Password=Password1!;" +
        "Encrypt=False;" +
        "Trust Server Certificate=True");
});

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<RenTeslaDbContext>();

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
    .AddScoped<IAuthService, AuthService>()

    .AddScoped<IDatabaseSeeder, DatabaseSeeder>()

    .AddScoped<IReservationCreateRequestValidator, ReservationCreateRequestValidator>()
    .AddScoped<IReservationByCodeQueryRequestValidator, ReservationByCodeQueryRequestValidator>()
    .AddScoped<IAuthRequestValidator, AuthRequestValidator>();

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
    var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();
    await seeder.EnsureDatabaseInitializedAsync();
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
