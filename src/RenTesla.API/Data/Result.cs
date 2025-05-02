namespace RenTesla.API.Data;

public record Result<TDataType>
{
    public bool IsSuccess => Errors.Count == 0;
    public TDataType Data { get; init; }
    public IReadOnlyCollection<string> Errors { get; init; } = [];

    public Result(TDataType data, IReadOnlyCollection<string> errors)
    {
        Data = data;
        Errors = errors;
    }
}

public record Result
{
    public bool IsSuccess => Errors.Count == 0;
    public IReadOnlyCollection<string> Errors { get; init; } = [];
}
