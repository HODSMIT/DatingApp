using System;
using API.DATA;
using API.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;

namespace API.Helper;

public class LogUserActivity : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext = await next();

        if (context.HttpContext.User.Identity?.IsAuthenticated != true)
        {
            return;
        }

        var memberId = resultContext.HttpContext.User.GetMemberById();

        var dbcontext = resultContext.HttpContext.RequestServices
        .GetRequiredService<AppDbContext>();        //throw new NotImplementedException();

        await dbcontext.Members.Where(x => x.Id == memberId).ExecuteUpdateAsync(setters => setters.SetProperty(x => x.LastActive, DateTime.UtcNow));
    }
}
