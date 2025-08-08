using System;
using API.Entities;

namespace API.Interface;

public interface IMemberReporsitory
{
    void Update(Member member);
    Task<bool> SaveAllAsync();

    Task<IReadOnlyList<Member>> GetMembersAync();

    Task<Member?> GetMemberByIdAsync(string id);

    Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId);


}
