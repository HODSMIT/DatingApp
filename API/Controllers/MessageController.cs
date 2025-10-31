using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helper;
using API.Interface;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessageController(IMessageRepository messageRepository,IMemberReporsitory memberReporsitory) : BaseController
{
    [HttpPost]

    public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
    {
        var sender = await memberReporsitory.GetMemberByIdAsync(User.GetMemberById());

        var recipient = await memberReporsitory.GetMemberByIdAsync(createMessageDto.RecipientId);

        if (recipient == null || sender == null || sender.Id == createMessageDto.RecipientId)
        {
            return BadRequest("Cannot Sent this Message");
        }

        var message = new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = createMessageDto.Content
        };

        messageRepository.AddMessage(message);

        if (await messageRepository.SaveAllAsync())
        {
            return message.ToDto();
        }

        return BadRequest("Fail to send Message");
    }

    [HttpGet]

    public async Task<ActionResult<PaginationResult<MessageDto>>> GetMessagesByContainer([FromQuery] MemberParam messageParams)
    {
        messageParams.MemberId = User.GetMemberById();

        return await messageRepository.GetMessagesForMember(messageParams);
    }


    [HttpGet("thread/{recipientId}")]
    public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string recipientId)
    {
        return Ok(await messageRepository.GetMessagesThread(User.GetMemberById(), recipientId));
    }


}


