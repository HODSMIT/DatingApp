using System;

namespace API.Errors;

public class ApiException(int StatusCode,string Message,string? details)
{
    public int StatusCode { get; set; } = StatusCode;

    public string Message { get; set; } = Message;

    public string? details { get; set; } = details;
}
