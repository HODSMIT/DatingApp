using System;
using API.Entities;
using API.Helper;

namespace API.Interface;

public interface ILikesRepository
{
    Task<MemberLikes?> GetMemberLike(string sourceMemberId, string targetMemberId);
    Task<PaginationResult<Member>> GetMemberLikes(LikesParam likesParams);

    Task<IReadOnlyList<string>> GetCurrentMemberLikesId(string memberId);

    void DeleteLikes(MemberLikes like);

    void AddLike(MemberLikes like);

    //Task<bool> SaveAllChanges();  
}
