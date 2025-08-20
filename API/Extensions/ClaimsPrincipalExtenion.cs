using System;
using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipalExtenion
{
    public static string GetMemberById(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("Cannot get member id from token ");
    }

}
