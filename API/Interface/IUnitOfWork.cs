using System;
using API.Interfaces;

namespace API.Interface;

public interface IUnitofWork
{

    IMemberReporsitory MemberReporsitory {get;}

    IMessageRepository MessageRepository {get;}

    ILikesRepository LikesRepository {get;}

    Task<bool> Complete();

    bool HasChanges();



}
