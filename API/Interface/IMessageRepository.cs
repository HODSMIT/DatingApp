using System;
using API.DTOs;
using API.Entities;
using API.Helper;

namespace API.Interface;

public interface IMessageRepository
{

    void AddMessage(Message message);
    void DeleteMessage(Message message);

    Task<Message?> GetMessage(string messageId);

    Task<PaginationResult<MessageDto>> GetMessagesForMember(MemberParam messageParams);

    Task<IReadOnlyList<MessageDto>> GetMessagesThread(string currentMemberId, string receipienId);


    Task<bool> SaveAllAsync();


}
