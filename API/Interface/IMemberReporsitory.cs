using System;
using API.Entities;
using API.Helper;

namespace API.Interface;

public interface IMemberReporsitory
{
    void Update(Member member);
    Task<bool> SaveAllAsync();

    Task<PaginationResult<Member>> GetMembersAync(MemberParams memberParams);

    Task<Member?> GetMemberByIdAsync(string id);

    Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId);

    Task<Member?> GetMemberForUpdate(string id);


}
