namespace RenTesla.API.Data;

public record Result<TDataType>
{
    public TDataType? Data { get; init; }
    public Dictionary<string, List<string>> Errors { get; init; } = [];
    public ErrorType? ErrorType { get; init; }
    public bool IsErrorNotFound => ErrorType == API.Data.ErrorType.NotFound;
    public bool IsErrorValidation => ErrorType == API.Data.ErrorType.Validation;

    public Result(TDataType data, Dictionary<string, List<string>> errors, ErrorType? errorType = null)
    {
        Data = data;
        Errors = errors;
        ErrorType = errorType;
    }
}

public record Result
{
    public Dictionary<string, List<string>> Errors { get; init; } = [];
    public ErrorType? ErrorType { get; set; }
    public bool IsErrorNotFound => ErrorType == Data.ErrorType.NotFound;
    public bool IsErrorValidation => ErrorType == Data.ErrorType.Validation;
    public Result(Dictionary<string, List<string>> errors, ErrorType? errorType = null)
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