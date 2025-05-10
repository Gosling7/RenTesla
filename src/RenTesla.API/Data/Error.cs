namespace RenTesla.API.Data;

public class Error
{
    public string Message { get; }
    public string PropertyName { get; }
    public SimpleErrorType Type { get; }

    public Error(string property, string message, SimpleErrorType type)
    {
        PropertyName = property;
        Message = message;
        Type = type;
    }
}

public enum SimpleErrorType
{
    NotFound,
    Validation,
    Unauthorized
}