namespace RenTesla.API.Interfaces;

public interface IDatabaseSeeder
{
    Task EnsureDatabaseInitializedAsync();
}