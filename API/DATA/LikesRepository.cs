using System;
using API.Entities;
using API.Interface;
using Microsoft.EntityFrameworkCore;

namespace API.DATA;

public class LikesRepository(AppDbContext context) : ILikesRepository
{
    public void AddLike(MemberLikes like)
    {
        context.Likes.Add(like);
    }

    public void DeleteLikes(MemberLikes like)
    {
        context.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikesId(string memberId)
    {
        return await context.Likes
        .Where(x => x.SourceMemberId == memberId)
        .Select(x => x.TargetMemberId)
        .ToListAsync();
    }

    public async Task<MemberLikes?> GetMemberLike(string sourceMemberId, string targetMemberId)
    {
        return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
    }

    public  async Task<IReadOnlyList<Member>> GetMemberLikes(string predicate, string memberId)
    {
        var query = context.Likes.AsQueryable();

        switch (predicate)
        {
            case "liked":
                return await query
                  .Where(x => x.SourceMemberId == memberId)
                  .Select(x => x.TargetMember)
                  .ToListAsync();
            case "likedBy":
                return await query
                  .Where(x => x.TargetMemberId == memberId)
                  .Select(x => x.SourceMember)
                  .ToListAsync();
            default: //Mutual
                var likeIds = await GetCurrentMemberLikesId(memberId);
                return await query.Where(x => x.TargetMemberId == memberId && likeIds.Contains(x.SourceMemberId))
                .Select(x=>x.SourceMember).ToListAsync();

        }
    }

    public async Task<bool> SaveAllChanges()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
