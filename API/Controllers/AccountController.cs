using System.Security.Cryptography;
using System.Text;
using API.DATA;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController(AppDbContext context,ITokenService tokenService) : BaseController
    {
        [HttpPost("register")] //api/aacount/register

        public async Task<ActionResult<UserDto>> Register(registerDto RegisterDto)
        {
            if (await EmailExist(RegisterDto.Email))
            {
                return BadRequest("Email Already Taken");
            }
            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                DisplayName = RegisterDto.DisplayName,
                Email = RegisterDto.Email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(RegisterDto.Password)),
                PasswordSalt = hmac.Key

            };


            context.Users.Add(user);
            await context.SaveChangesAsync();

            return user.ToDto(tokenService);
        }


        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto logdto)
        {
            var user = await context.Users.SingleOrDefaultAsync(x => x.Email == logdto.email);
            if (user == null)
            {
                return Unauthorized("Invalid Email address");
            }
            using var hmac = new HMACSHA512(user.PasswordSalt);

            var ComputeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(logdto.Password));

            for (var i = 0; i < ComputeHash.Length; i++)
            {
                if (ComputeHash[i] != user.PasswordHash[i])
                {
                    return Unauthorized("Invalid Password");
                }
            }
            return user.ToDto(tokenService);    
        }

        private async Task<bool> EmailExist(string email)
        {
            return await context.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
        }

    }

    
}
