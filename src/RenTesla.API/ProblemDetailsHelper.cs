using Microsoft.AspNetCore.Mvc;

namespace RenTesla.API;

public static class ProblemDetailsHelper
{
    public static ValidationProblemDetails CreateValidationProblemDetails(
        HttpContext httpContext,
        IDictionary<string, List<string>> errors,
        string title = "One or more validation errors occurred.",
        string type = "https://tools.ietf.org/html/rfc9110#section-15.5.1",
        int statusCode = StatusCodes.Status400BadRequest)
    {
        var stringArrayErrors = errors.ToDictionary(
            kvp => kvp.Key,
            kvp => kvp.Value.ToArray());

        var problemDetails = new ValidationProblemDetails(stringArrayErrors)
        {
            Type = type,
            Title = title,
            Status = statusCode,
            Instance = $"{httpContext.Request.Method} {httpContext.Request.Path}"
        };

        problemDetails.Extensions["traceId"] = httpContext.TraceIdentifier;

        return problemDetails;
    }

    public static ProblemDetails CreateNotFoundProblemDetails(
        HttpContext httpContext,
        string detail,
        string title = "Resource not found.",
        string type = "https://tools.ietf.org/html/rfc9110#section-15.5.5",
        int statusCode = StatusCodes.Status404NotFound)
    {
        var problemDetails = new ProblemDetails()
        {
            Type = type,
            Title = title,
            Status = statusCode,
            Instance = $"{httpContext.Request.Method} {httpContext.Request.Path}",
            Detail = detail
        };

        problemDetails.Extensions["traceId"] = httpContext.TraceIdentifier;

        return problemDetails;
    }
}
