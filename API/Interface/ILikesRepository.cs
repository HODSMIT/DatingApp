using System;
using API.Entities;

namespace API.Interface;

public interface ILikesRepository
{
    Task<MemberLikes?> GetMemberLike(string sourceMemberId, string targetMemberId);
    Task<IReadOnlyList<Member>> GetMemberLikes(string predicate, string memberId);

    Task<IReadOnlyList<string>> GetCurrentMemberLikesId(string memberId);

    void DeleteLikes(MemberLikes like);

    void AddLike(MemberLikes like);

    Task<bool> SaveAllChanges();  
}
