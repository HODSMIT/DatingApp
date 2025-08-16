using System;

namespace API.DTOs;

public class LoginDto
{
    public string email { get; set; } = "";

    public string Password { get; set; } = "";
}