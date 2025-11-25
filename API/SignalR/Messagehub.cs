using System;
using System.Net.Http.Headers;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interface;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Primitives;

namespace API.SignalR;

[Authorize]
public class Messagehub(IMessageRepository messageRepository,IMemberReporsitory memberReporsitory) : Hub
{
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var otherUser = httpContext?.Request.Query["userId"] 
        ?? throw new HubException("Other User not Found");

        var groupName = GetGroupName(GetUserId(),otherUser);
        await Groups.AddToGroupAsync(Context.ConnectionId,groupName);

        var messages = await messageRepository.GetMessageThread(GetUserId(),otherUser);

        await Clients.Group(groupName).SendAsync("ReceiveMessageThread",messages);
    }

    private static string GetGroupName(string? caller, string? other)
    {

        var StringCompare = string.CompareOrdinal(caller,other) < 0;
        return StringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        
    }

    public async Task SendMessage(CreateMessageDto createMessageDto)
    {
        var sender = await memberReporsitory.GetMemberByIdAsync(GetUserId());
        var recipient = await memberReporsitory.GetMemberByIdAsync(createMessageDto.RecipientId);

        if (recipient == null || sender == null || sender.Id == createMessageDto.RecipientId)
            throw new HubException("Cannot send this message");

        var message = new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = createMessageDto.Content
        };

        messageRepository.AddMessage(message);

        if (await messageRepository.SaveAllAsync())
        {
            var group = GetGroupName(sender.Id,recipient.Id);
            await Clients.Group(group).SendAsync("NewMessage",message.ToDto());
        }
    }

    private string GetUserId()
    {
        return Context.User?.GetMemberById() ?? throw new HubException("Cannot get Member id");
    }

}
