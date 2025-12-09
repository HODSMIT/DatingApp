using System;
using API.Entities;
using API.Helper;
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

    public  async Task<PaginationResult<Member>> GetMemberLikes(LikesParam likesParams)
    {
        var query = context.Likes.AsQueryable();
        IQueryable<Member> result;

        switch (likesParams.Predicate)
        {
            case "liked":
                result = query
                  .Where(x => x.SourceMemberId == likesParams.MemberId)
                  .Select(x => x.TargetMember);
                break;
            case "likedBy":
                result = query
                  .Where(x => x.TargetMemberId == likesParams.MemberId)
                  .Select(x => x.SourceMember);
                break;
            default: //Mutual
                var likeIds = await GetCurrentMemberLikesId(likesParams.MemberId);

                result = query.Where(x => x.TargetMemberId == likesParams.MemberId 
                && likeIds.Contains(x.SourceMemberId))
                .Select(x => x.SourceMember);
                break;

        }
        return await PaginationHelper.CreateAsync(result, likesParams.pageNumber, likesParams.PageSize);
    }


}
