using System;
using System.Collections.Concurrent;

namespace API.SignalR;

public class PresenceTracker
{

    private static readonly ConcurrentDictionary<string,ConcurrentDictionary<string,byte>> OnlineUser = new();

    public Task UserConnected(string userId,string connectionId)
    {
        var connections = OnlineUser.GetOrAdd(userId, _ => new ConcurrentDictionary<string, byte>());

        connections.TryAdd(connectionId,0);
        return Task.CompletedTask;
    }

    public Task UserDisconnect(string userId,string connectionId)
    {
        if(OnlineUser.TryGetValue(userId,out var connections))
        {
            connections.TryRemove(connectionId,out _);
            if (connections.IsEmpty)
            {
                OnlineUser.TryRemove(userId,out _);
            }
        }

        return Task.CompletedTask;
    }


    public Task<string []> GetOnlineUser()
    {
        return Task.FromResult(OnlineUser.Keys.OrderBy(k => k).ToArray());
    }

       public static Task<List<string>> GetConnectionsForUser(string userId)
    {
        if (OnlineUser.TryGetValue(userId, out var connections))
        {
            return Task.FromResult(connections.Keys.ToList());
        }

        return Task.FromResult(new List<string>());
    }

}
