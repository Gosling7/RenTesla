namespace RenTesla.API.Data;

public class Result<T>
{
    public T? Value { get; }
    public IReadOnlyCollection<Error> Errors { get; }
    
    private Result(IReadOnlyCollection<Error> errors)
    {
        Errors = errors;
        Value = default;
    }

    private Result(T value)
    {
        Value = value;
        Errors = [];
    }
    
    public bool IsValidationError => Errors.Any(e => e.Type == SimpleErrorType.Validation);
    public bool IsNotFoundError => Errors.Any(e => e.Type == SimpleErrorType.NotFound);
    public bool IsUnauthorizedError => Errors.Any(e => e.Type == SimpleErrorType.Unauthorized);

    public static Result<T> Success(T value) => new(value);
    public static Result<T> Failure(IReadOnlyCollection<Error> errors) => new(errors);
}

public class SimpleResult
{
    public IReadOnlyCollection<Error> Errors { get; }

    private SimpleResult(IReadOnlyCollection<Error> errors)
    {
        Errors = errors;
    }

    private SimpleResult()
    {
        Errors = [];
    }

    public bool IsValidationError => Errors.Any(e => e.Type == SimpleErrorType.Validation);
    public bool IsNotFoundError => Errors.Any(e => e.Type == SimpleErrorType.NotFound);

    public static SimpleResult Success() => new();
    public static SimpleResult Failure(IReadOnlyCollection<Error> errors) => new(errors);
}
