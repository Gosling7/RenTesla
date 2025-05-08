namespace RenTesla.API.Data;

public record ResultOld<TDataType>
{
    public bool IsSuccess => Errors.Count == 0;
    public TDataType? Data { get; init; }
    public IReadOnlyCollection<string> Errors { get; init; } = [];

    public ResultOld(TDataType data, IReadOnlyCollection<string> errors)
    {
        Data = data;
        Errors = errors;
    }
}

public record Result<TDataType>
{
    public bool IsSuccess => Errors.Count == 0;
    public TDataType? Data { get; init; }
    public Dictionary<string, List<string>> Errors { get; init; } = [];
    public ErrorType? ErrorType { get; init; }

    public Result(TDataType data, Dictionary<string, List<string>> errors, ErrorType? errorType)
    {
        Data = data;
        Errors = errors;
        ErrorType = errorType;
    }
}

public record Result
{
    public bool IsSuccess => Errors.Count == 0;
    public Dictionary<string, List<string>> Errors { get; init; } = [];
    public ErrorType? ErrorType { get; init; }
    public Result(Dictionary<string, List<string>> errors, ErrorType? errorType)
    {
        Errors = errors;
        ErrorType = errorType;
    }
}

public enum ErrorType
{
    Validation,
    NotFound
}