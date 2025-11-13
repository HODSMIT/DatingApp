using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Entities;
using API.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using SQLitePCL;

namespace API.Services;

public class TokenService(IConfiguration config,UserManager<AppUser> userManager) : ITokenService
{
    public async Task<string> CreateToken(AppUser user)
    {
        var tokenKey = config["TokenKey"] ?? throw new Exception("Cannot Get token KEy");
        if (tokenKey.Length < 64)
        {
            throw new Exception("Your Token Needs to be >= 64");
        }
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

        var claim = new List<Claim>
        {
            new(ClaimTypes.Email,user.Email!),
            new(ClaimTypes.NameIdentifier,user.Id)
        };

        var roles = await userManager.GetRolesAsync(user);

        claim.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var tokendescripter = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claim),
            Expires = DateTime.UtcNow.AddMinutes(7),
            SigningCredentials = cred
        };

        var tokenhandler = new JwtSecurityTokenHandler();
        var token = tokenhandler.CreateToken(tokendescripter);

        return tokenhandler.WriteToken(token);

    }

    public string GenerateRefreshToken()
    {
        var randomBytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(randomBytes);
    }
}
