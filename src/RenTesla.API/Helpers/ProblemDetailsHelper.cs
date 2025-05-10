using Microsoft.AspNetCore.Mvc;
using RenTesla.API.Data;

namespace RenTesla.API.Helpers;

public static class ProblemDetailsHelper
{
    public static ValidationProblemDetails CreateValidationProblemDetails(
        HttpContext httpContext,
        IDictionary<string, List<string>> errors,
        string title = "One or more validation errors occurred",
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

    public static ValidationProblemDetails SimpleCreateValidationProblemDetails(
        HttpContext httpContext,
        IEnumerable<Error> errors,
        string title = "One or more validation errors occurred",
        string type = "https://tools.ietf.org/html/rfc9110#section-15.5.1",
        int statusCode = StatusCodes.Status400BadRequest)
    {
        var errorsDict = errors
            .GroupBy(error => error.PropertyName)
            .ToDictionary(
                group => group.Key,
                group => group.Select(error => error.Message).ToArray());

        var problemDetails = new ValidationProblemDetails(errorsDict)
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
        string title = "Resource not found",
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

    public static ProblemDetails SimpleCreateNotFoundProblemDetails(
        HttpContext httpContext,
        string detail,
        string title = "Resource not found",
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

    public static ProblemDetails SimpleUnauthorizedProblemDetails(
        HttpContext httpContext,
        string title = "Unauthorized",
        string type = "https://tools.ietf.org/html/rfc9110#section-15.5.2",
        int statusCode = StatusCodes.Status401Unauthorized)
    {
        var problemDetails = new ProblemDetails()
        {
            Type = type,
            Title = title,
            Status = statusCode,
            Instance = $"{httpContext.Request.Method} {httpContext.Request.Path}",
        };

        problemDetails.Extensions["traceId"] = httpContext.TraceIdentifier;

        return problemDetails;
    }
}
