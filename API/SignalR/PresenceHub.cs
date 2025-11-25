using System.Security.Claims;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
public class PresenceHub(PresenceTracker presenceTracker) : Hub
{
    public override async Task OnConnectedAsync()
    {
        await presenceTracker.UserConnected(Context.User.GetMemberById() , Context.ConnectionId);
        await Clients.Others.SendAsync(
            "UserOnline",
            GetUserId()
        );
        var currentUsers = await presenceTracker.GetOnlineUser();
        await Clients.All.SendAsync("GetOnline",currentUsers);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {

        await presenceTracker.UserDisconnect(GetUserId(),Context.ConnectionId);
        
        await Clients.Others.SendAsync(
            "UserOffline",
            GetUserId()
        );
        var currentUsers = await presenceTracker.GetOnlineUser();
        await Clients.All.SendAsync("GetOnline",currentUsers);
        await base.OnDisconnectedAsync(exception);
    }


    private string GetUserId()
    {
        return Context.User?.GetMemberById() ?? throw new HubException("Cannot get Member id");
    }
}
