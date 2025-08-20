using System;
using API.Entities;
using API.Interface;
using Microsoft.EntityFrameworkCore;

namespace API.DATA;

public class MemberRepository(AppDbContext context) : IMemberReporsitory
{
    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }

    public async Task<Member?> GetMemberForUpdate(string id)
    {
        return await context.Members.Include(x => x.User).SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IReadOnlyList<Member>> GetMembersAync()
    {
        return await context.Members
        .ToListAsync();
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
    {
        return await context.Members
        .Where(x => x.Id == memberId)
        .SelectMany(x => x.Photos)
        .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }
}
