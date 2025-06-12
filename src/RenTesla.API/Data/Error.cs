namespace RenTesla.API.Data;

public class Error
{
    public string Message { get; }
    public string PropertyName { get; }
    public ErrorType Type { get; }

    public Error(string property, string message, ErrorType type)
    {
        PropertyName = property;
        Message = message;
        Type = type;
    }
}

public enum ErrorType
{
    NotFound,
    Validation,
    Unauthorized
}