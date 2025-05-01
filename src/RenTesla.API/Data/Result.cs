namespace RenTesla.API.Data;

public record Result<TDataType>(
    IReadOnlyCollection<string> Errors,
    IEnumerable<TDataType> Data);
