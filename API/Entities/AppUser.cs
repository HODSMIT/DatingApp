using System;
using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser : IdentityUser
{
    //public string Id { get; set; } = Guid.NewGuid().ToString();

    public string? DisplayName { get; set; }

    //public string? Email { get; set; }


    public string? ImageUrl { get; set; }

    public string? RefreshToken { get; set; }

    public DateTime? RefreshTokenExpiry { get; set; }

    //public required byte[] PasswordHash { get; set; }

    //public required byte[] PasswordSalt { get; set; }


    //Navigation property 

    public Member Member { get; set; } = null!;

}
