using System;
using System.Data.Common;
using API.Data;
using API.Interface;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.DATA;

public class UnitOfWork(AppDbContext context) : IUnitofWork
{
    private IMemberReporsitory? _memberRepository;

    private IMessageRepository? _messageRepository;

    private ILikesRepository? _likesRepository;
    public IMemberReporsitory MemberReporsitory => _memberRepository ??= 
    new MemberRepository(context);

    public IMessageRepository MessageRepository => _messageRepository ??= new MessageRepository(context);

    public ILikesRepository LikesRepository => _likesRepository ??= new LikesRepository(context);

    public async Task<bool> Complete()
    {
        try
        {
            return await context.SaveChangesAsync() > 0;
        }
        catch(DbUpdateException ex)
        {
            throw new Exception("An error occured while Saving chnages",ex);
        }
    }

    public bool HasChanges()
    {
        return context.ChangeTracker.HasChanges();
    }
}
