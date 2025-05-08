using System.ComponentModel.DataAnnotations;

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

    public Result(TDataType data, Dictionary<string, List<string>> errors)
    {
        Data = data;
        Errors = errors;
    }
}

public record Result
{
    public bool IsSuccess => Errors.Count == 0;
    public IReadOnlyCollection<string> Errors { get; init; } = [];
    public Result(IReadOnlyCollection<string> errors)
    {
        Errors = errors;
    }
}
