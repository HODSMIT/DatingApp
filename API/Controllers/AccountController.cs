using System.Security.Cryptography;
using System.Text;
using System.Xml.XPath;
using API.DATA;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interface;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService) : BaseController
    {
        [HttpPost("register")] //api/aacount/register

        public async Task<ActionResult<UserDto>> Register(registerDto RegisterDto)
        {
            var user = new AppUser
            {
                DisplayName = RegisterDto.DisplayName,
                Email = RegisterDto.Email,
                UserName = RegisterDto.Email,
                Member = new Member
                {
                    DisplayName = RegisterDto.DisplayName,
                    Gender = RegisterDto.Gender,
                    City = RegisterDto.City,
                    Country = RegisterDto.Country,
                    DateOfBirth = RegisterDto.DateOfBirth
                }

            };


            var result = await userManager.CreateAsync(user, RegisterDto.Password);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("identity", error.Description);
                }

                return ValidationProblem();
            }
            await userManager.AddToRoleAsync(user, "Member");

            await SetRefreshTokenCookie(user);
            return await user.ToDto(tokenService);
        }


        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto logdto)
        {
            var user = await userManager.FindByEmailAsync(logdto.email);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid Email address" });
            }
            var result = await userManager.CheckPasswordAsync(user, logdto.Password);

            if (!result)
            {
                Unauthorized("Invalid Password");
            }

            await SetRefreshTokenCookie(user);
            return await user.ToDto(tokenService);
        }

        private async Task SetRefreshTokenCookie(AppUser user)
        {
            var refreshToken = tokenService.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken);

        }

        [HttpPost("refresh-token")]

        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (refreshToken == null) return NoContent();

            var user = await userManager.Users.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken && x.RefreshTokenExpiry > DateTime.UtcNow);

            if (user == null) return Unauthorized();

            await SetRefreshTokenCookie(user);

            return await user.ToDto(tokenService);



        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult> Logput()
        {
            await userManager.Users.Where(x=>x.Id == User.GetMemberById())
            .ExecuteUpdateAsync(setters => setters
            .SetProperty(x=>x.RefreshToken,_ => null)
            .SetProperty(x => x.RefreshTokenExpiry, _ => null));

            Response.Cookies.Delete("refershToken");

            return Ok(); 
        }


    }
}
