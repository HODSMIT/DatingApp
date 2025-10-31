using System;
using API.DATA;
using API.Entities;
using API.Helper;
using API.Interface;
using Microsoft.EntityFrameworkCore;

namespace API.DTOs;

public class MessageRepository(AppDbContext context) : IMessageRepository
{
    public void AddMessage(Message message)
    {
        context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Message?> GetMessage(string messageId)
    {
        return await context.Messages.FindAsync(messageId);
        //throw new NotImplementedException();
    }

    public async Task<PaginationResult<MessageDto>> GetMessagesForMember(MemberParam messageParams)
    {
        var query = context.Messages.OrderByDescending(x => x.MessageSent).AsQueryable();

        query = messageParams.Container switch
        {
            "Outbox" => query.Where(x => x.SenderId == messageParams.MemberId),
            _ => query.Where(x => x.RecipientId == messageParams.MemberId)

        };


        var messageQuery = query.Select(MessageExtension.ToDtoProjection());

        return await PaginationHelper.CreateAsync(messageQuery, messageParams.pageNumber, messageParams.PageSize); 

        //throw new NotImplementedException();
    }

    public async Task<IReadOnlyList<MessageDto>> GetMessagesThread(string currentMemberId, string receipienId)
    {
        await context.Messages.Where(x => x.RecipientId == currentMemberId && x.SenderId == receipienId && x.DateRead == null)
        .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.DateRead, DateTime.UtcNow));


        return await context.Messages.Where(x => (x.RecipientId == currentMemberId && x.SenderId == receipienId)
        || (x.SenderId == currentMemberId && x.RecipientId == receipienId)).OrderBy(x => x.MessageSent)
        .Select(MessageExtension.ToDtoProjection())
        .ToListAsync();
        //throw new NotImplementedException();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
        //throw new NotImplementedException();
    }
}
