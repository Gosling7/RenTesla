﻿using Microsoft.EntityFrameworkCore;
using RenTesla.API.Data;
using RenTesla.API.Data.DTOs;
using RenTesla.API.Interfaces;

namespace RenTesla.API.Services;

public class LocationService : ILocationService
{
    private readonly RenTeslaDbContext _dbContext;

    public LocationService(RenTeslaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<IEnumerable<LocationDto>>> GetLocationsAsync()
    {
        var locations = await _dbContext.Locations
            .Select(l => new LocationDto(l.Id.ToString(), l.Name))
            .ToListAsync();

        return Result<IEnumerable<LocationDto>>.Success(locations);
    }
}
