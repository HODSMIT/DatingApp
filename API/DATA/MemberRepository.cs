using System;
using API.Entities;
using API.Helper;
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
        return await context.Members.Include(x => x.Photos).Include(x => x.User).SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<PaginationResult<Member>> GetMembersAync(MemberParams memberParams)
    {
        var query = context.Members.AsQueryable();

        query = query.Where(x => x.Id != memberParams.CurrentmemberId);

        if (memberParams.Gender != null)
        {
            query = query.Where(x => x.Gender == memberParams.Gender);    
        }

        //var mindob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.Maxage - 1));

        //var maxdob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));

        //query = query.Where(x => x.DateofBirth >= mindob && x.DateofBirth <= maxdob);

        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(x => x.Created),
            _ => query.OrderByDescending(x => x.LastActive)
        };
        return await PaginationHelper.CreateAsync(query,
        memberParams.pageNumber, memberParams.PageSize);
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
